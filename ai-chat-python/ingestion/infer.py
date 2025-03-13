import pandas as pd
from supabase import create_client, Client
from openai import OpenAI
from dotenv import load_dotenv
import os
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import ast
import re


# Load environment variables
load_dotenv()
supabaseUrl = os.getenv("REACT_APP_SUPABASE_URL")
supabaseKey = os.getenv("REACT_APP_SUPABASE_KEY")

supabase: Client = create_client(supabaseUrl, supabaseKey)
aiClient= OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def main():

    # Get job data from supabase
    df1 = get_job_data("cryptojobscom")
    df2 = get_job_data("web3career")

    print("\nDataset 1 size:", len(df1))
    print("Dataset 2 size:", len(df2))

    # Calculate job similarity
    combined_df = calculate_job_similarity(df1, df2)
    print("\nFinal combined dataset size:", len(combined_df))

    # Infer job function
    combined_df = infer_job_function(combined_df)
    print("Job functions inferred")

    # Infer location
    combined_df = infer_location(combined_df)
    print("Locations inferred")

    # Clean data
    combined_df = clean_data(combined_df)

    # Select columns to keep
    combined_df = combined_df[['title', 'job_function','company', 'location','salary_amount', 'skills', 'source', 'job_url', 'job_id', 
                               'posted_date', 'is_remote',  'ingestion_date', 'my_id']].sort_values(by='posted_date', ascending=False)


    combined_df.to_csv("combined_df.csv", index=False)
    # Upload to supabase
    upload_to_supabase(combined_df, "jobs_clean")

    return combined_df


def calculate_job_similarity(df1: pd.DataFrame, df2: pd.DataFrame):

    # Reset index
    df1 = df1.reset_index(drop=True)
    df2 = df2.reset_index(drop=True)

    # Ensure all columns are strings
    df1["title"] = df1["title"].fillna("").astype(str)
    df1["company"] = df1["company"].fillna("").astype(str)
    df2["title"] = df2["title"].fillna("").astype(str)
    df2["company"] = df2["company"].fillna("").astype(str)

    # Combine title, company, and posted date into a single column for identification
    df1["combined"] = df1["title"] + " " + df1["company"]
    df2["combined"] = df2["title"] + " " + df2["company"] 

    # Get embeddings for the combined columns   
    df1['embedding'] = df1['combined'].apply(get_embedding)
    df2['embedding'] = df2['combined'].apply(get_embedding)

    # Convert embeddings to numpy arrays
    df1_embeddings = np.array(df1["embedding"].tolist())
    df2_embeddings = np.array(df2["embedding"].tolist())

    # Calculate cosine similarity between embeddings
    similarity_matrix = cosine_similarity(df1_embeddings, df2_embeddings)

    threshold = 0.85
    
    # Find similar pairs above threshold
    similar_indices = np.where(similarity_matrix > threshold)
    similar_pairs = pd.DataFrame({
        'job1_index': similar_indices[0],
        'job2_index': similar_indices[1],
        'similarity': similarity_matrix[similar_indices],
        'job1_title': df1.iloc[similar_indices[0]]['title'].values,
        'job2_title': df2.iloc[similar_indices[1]]['title'].values,
        'job1_company': df1.iloc[similar_indices[0]]['company'].values,
        'job2_company': df2.iloc[similar_indices[1]]['company'].values,
        'job1_location': df1.iloc[similar_indices[0]]['location'].values,
        'job2_location': df2.iloc[similar_indices[1]]['location'].values
    })
    
    if not similar_pairs.empty:
        # Sort by similarity
        similar_pairs = similar_pairs.sort_values('similarity', ascending=False)
        
        # Create masks for location presence
        job1_has_location = similar_pairs['job1_location'].notna()
        job2_has_location = similar_pairs['job2_location'].notna()
        
        # Create masks for different conditions
        # Keep job2 if it has location and job1 does not
        keep_job2 = (job1_has_location == False) & (job2_has_location == True)
        # Keep job1 if it does not have location or job2 does not have location
        keep_job1 = ~keep_job2 
        
        # Get unique indices to drop from both dataframes
        indices_to_drop_df1 = set(similar_pairs[keep_job2]['job1_index'])
        indices_to_drop_df2 = set(similar_pairs[keep_job1]['job2_index'])
        
        # Remove duplicates from both dataframes
        df1_unique = df1.drop(indices_to_drop_df1)
        df2_unique = df2.drop(indices_to_drop_df2)
        
        print(f"\nFound {len(similar_pairs)} pairs of similar jobs above threshold {threshold}")
        print(f"Removed {len(indices_to_drop_df1)} jobs from first dataset")
        print(f"Removed {len(indices_to_drop_df2)} jobs from second dataset")
        print("\nSimilar job pairs:")
        
        # Combine unique jobs from both sources
        combined_df = pd.concat([df1_unique, df2_unique]).reset_index(drop=True)
    
    else:
        print("\nNo similar jobs found above threshold")
        # Combine all jobs from both sources
        combined_df = pd.concat([df1, df2]).reset_index(drop=True)
    
    return combined_df


def get_embedding(text):
    # Get embedding for text
    response = aiClient.embeddings.create(
        model="text-embedding-3-small",
        input=text,
        encoding_format="float"
    )
    return response.data[0].embedding  


def infer_location(df):

    # First handle cases of remote work or unknown location
    df['location_country'] = df['location'].apply(
        lambda x: 'Remote' if isinstance(x, str) and 'remote' in x.lower() 
        else 'Unknown' if pd.isna(x) or x == '' 
        else None
    )
    df['location_country'] = df['is_remote'].apply(
        lambda x: 'Remote' if x else None
    )
    
    # Get unique locations that need AI processing
    locations_to_process = df[df['location_country'].isna()]['location'].unique()
    
    if len(locations_to_process) > 0:
        # Prepare batch of locations 
        locations_str = "\n".join([f"- {loc}" for loc in locations_to_process])
        prompt = f"""
        For each location, return only its country name.
        Use standard country names (e.g., "United States" not "USA").
        If it's a city/state, return its country.
        If it's a country, return the country.
        If it's a continent, return the continent.
        If it's unidentified, return "Unknown".
        
        Locations:
        {locations_str}
        
        Format: location -> country
        """
        
        # print(locations_str)
        response = aiClient.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        # print(response.choices[0].message.content)

        # Parse response and create mapping
        country_map = {}
        for line in response.choices[0].message.content.strip().split('\n'):
            if '->' in line:
                loc, country = line.split('->')
                country_map[loc.strip().replace("- ", "")] = country.strip()
        print(country_map)
        
        # Update DataFrame with inferred countries
        df.loc[df['location_country'].isna(), 'location_country'] = \
            df.loc[df['location_country'].isna(), 'location'].map(country_map)
    
    # Fill any remaining NAs with Unknown
    df['location_country'] = df['location_country'].fillna('Unknown')
    
    return df

    
def infer_job_function(df):
    df['job_function'] = "Unknown"
    df = df.reset_index(drop=True)

    # Resorting to key words matching for now because LLM is insufficient and needs some fine tuning! 
    # First use key words matching to infer job function
    engineering_keywords = ["Engineer", "developer", "DevOps", "Software", "Frontend", 
                            "Backend", "Full Stack", "Blockchain", "Smart Contract",
                            "solidity", "rust", "blockchain developer",
                            "blockchain engineer",
                            "Product", "Product Manager", "Product Owner", "Product Manager/Owner",
                            "Research Engineer", "QA Engineer", 
                            "Project Manager", "Technical Lead","Dev", "Cryptograph" ,
                            "qa", "system"]
    engineering_keywords = set(k.lower() for k in engineering_keywords)

    business_keywords = ["Business", "Strategy", "Operations", "Sales", "Marketing",
                         "Growth", "Partnerships", "Community", "Content", "Social Media",
                         "Customer Success", "Account Management", "Legal", "Compliance",
                         "HR", "People Operations", "Finance", "Accounting", "Administrative",
                         "Support", "Officer","Solutions", "Copywriter", "account",
                         "finance", "general", "executive", "financial", "tax", "treasury",
                         "payroll", "Program", "writer", "Event", "recruit", "representative",
                         "customer","auditor", ]
    business_keywords = set(k.lower() for k in business_keywords)
    
    design_keywords = ["Designer", "Design", "Art", "Creative", "UI/UX", "Graphic",
                       "Motion", "Visual",  "Animation", "3D", "Video"]
    design_keywords = set(k.lower() for k in design_keywords)
    
    data_keywords = ["Data", "Analytics", "Data Scientist", "Data Engineer", "Data Analyst", 
                     "Analytics Engineer", "Quantitative Researcher", "Business Intelligence"]
    data_keywords = set(k.lower() for k in data_keywords)
    
    for index, row in df.iterrows():
        # Clean the title 
        title = row['title'].lower()
        title = re.sub(r"\s*\(.*?\)", "", title).strip()
        title = title.replace("(", "").replace(")", "").strip()
        title = title.replace("/", "").strip()
        title = title.split(",")[0]
        title = title.split("-")[0]

        # Match in priority order: Data -> Engineering -> Business -> Art
        if any(keyword in title for keyword in data_keywords):
            matched_keyword = next(k for k in data_keywords if k in title)
            df.loc[index, 'job_function'] = "Data and Analytics"
        elif any(keyword in title for keyword in engineering_keywords):
            matched_keyword = next(k for k in engineering_keywords if k in title)
            df.loc[index, 'job_function'] = "Engineering, Product, and Research"
        elif any(keyword in title for keyword in business_keywords):
            matched_keyword = next(k for k in business_keywords if k in title)
            df.loc[index, 'job_function'] = "Business, Strategy, and Operations"
        elif any(keyword in title for keyword in design_keywords):
            matched_keyword = next(k for k in design_keywords if k in title)
            df.loc[index, 'job_function'] = "Design, Art, and Creative"
        else:
            df.loc[index, 'job_function'] = "Unknown"

    jobs_to_process = df[df['job_function'] == "Unknown"]
    jobs_to_process = jobs_to_process.reset_index(drop=True)
    print(f"Jobs to process with AI: {len(jobs_to_process)}")
    print(jobs_to_process['title'])

    for index, row in jobs_to_process.iterrows():
        # Clean the title 
        title = row['title'].lower()
        title = re.sub(r"\s*\(.*?\)", "", title).strip()
        title = title.replace("(", "").replace(")", "").strip()
        title = title.replace("/", "").strip()
        title = title.split(",")[0]
        title = title.split("-")[0]

        print(title)

        prompt = f"""
        You are an expert HR professional specializing in Web3 and blockchain industry job classifications.
        Focus on the core role/function and ignore modifiers like "Senior", "Lead", "Junior", "Head of", "Director", etc.

        ### Job Function Categories:

        1. Engineering, Product, and Research
           - Any Software Engineering role (Frontend, Backend, Full Stack)
           - Blockchain Developer/Engineer
           - Smart Contract Developer/Engineer
           - Protocol Engineer
           - Security Engineer
           - DevOps Engineer
           - Technical Lead/Architect
           - Product Manager/Owner
           - Research Engineer
           - QA Engineer
           - Solutions Engineer

        2. Business, Strategy, and Operations
           - Business Development
           - Operations
           - Project Manager
           - Account Manager
           - Community Manager
           - Program Manager
           - Legal/Compliance
           - HR/People Operations
           - Finance/Accounting
           - Administrative/Support

        3. Data and Analytics
           - Data Scientist
           - Data Engineer
           - Data Analyst
           - Business Intelligence
           - Quantitative Researcher
           - Analytics Engineer

        4. Design, Art, and Creative
           - UI/UX Designer
           - Product Designer
           - Graphic Designer
           - Creative Director
           - Motion Designer
           - Web Designer

        Job Title to Categorize: {title}

        Output Format: Return ONLY the category name of one of the following:
        Engineering, Product, and Research
        Business, Strategy, and Operations
        Data and Analytics
        Design, Art, and Creative
        """

        response = aiClient.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        jobs_to_process.loc[index, 'job_function'] = response.choices[0].message.content.strip()

    # Combine the processed jobs with the rest of the dataframe
    jobs_to_process['job_function'].replace("- ", "", inplace=True)
    df = pd.concat([df[df['job_function'] != "Unknown"], jobs_to_process]).reset_index(drop=True)
    return df

def clean_data(df):

    # Convert string representation of a list into an actual list
    df['skills'] = df['skills'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) and x.startswith('[') else x)

    # Add ingestion date and job ids
    df['ingestion_date'] = pd.Timestamp.now().strftime('%Y-%m-%d')
    df['job_id'] = df['job_id'].astype(int)
    df['my_id'] = df['ingestion_date'].astype(str) + "-" + df['job_id'].astype(str)

    # Replace infinities with None
    df['salary_amount'] = df['salary_amount'].replace([np.inf, -np.inf], pd.NA)  
    df['salary_amount'] = df['salary_amount'].astype("Int64")

    # Replace location with location_country
    df.drop(columns=['location'], inplace=True)
    df.rename(columns={'location_country': 'location'}, inplace=True)

    # Rename columns
    df.rename(columns={'posted_datetime': 'posted_date'}, inplace=True)
    

    return df

def upload_to_supabase(df, table_name: str):

    response = (
        supabase.table(table_name)
        .upsert(df.to_dict(orient="records"))
        .execute()
    )
    return response

def get_job_data(table_name: str) -> pd.DataFrame:
    response = (
        supabase.table(table_name)
        .select("*")
        .execute()
    )
    df = pd.DataFrame(response.data)
    return df

if __name__ == "__main__":
    main()