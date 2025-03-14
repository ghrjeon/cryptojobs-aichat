import DataTable from 'react-data-table-component';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CleanedTable from '../components/CleanedTable';
import styled from '@emotion/styled';
import DataMap from '../components/dataMap';
import CompanyChart from '../components/companyChart';
import FunctionChart from '../components/functionChart';
import DateChart from '../components/dateChart';
import SkillsTable from '../components/skillsTable';
import ReactMarkdown from 'react-markdown';

// Add Supabase client initialization
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const TitleContainer = styled.div`
  padding: 10px;
  margin: auto ;
`;


const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #34495e;
  }
`;

function Analysis() {
  const [jobFunctionStats, setJobFunctionStats] = useState({});
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from('jobs_clean')
          .select('*')
          .gte('posted_date', '2025-03-01');

        if (error) throw error;

        const jobStats = {
          totalJobs: fetchedData.length,
          minDate: fetchedData.reduce((min, job) => 
            job.posted_date < min ? job.posted_date : min, 
            fetchedData[0].posted_date),
          maxDate: fetchedData.reduce((max, job) => 
            job.posted_date > max ? job.posted_date : max, 
            fetchedData[0].posted_date)
        };

        setJobFunctionStats(jobStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <TitleContainer>
        <Title>Crypto Jobs Analysis</Title>

      <h2>Key Takeaways</h2>
      <div style={{ margin: '20px', display: 'flex', flexDirection: 'row', gap: '20px'}}> 
        <div className="card" style= {{
                backgroundColor: '#ebf1f5', padding: '10px', width: '65%',
                paddingLeft: '25px',
                borderRadius: '10px',
                lineHeight: '1.2',
            }}>
          <ReactMarkdown>
            {`
**Location:**
  - Listings are from 245 unique countries. 
  - More than 50% of the jobs are Remote, followed by US-based jobs (12.1%).

**Job Functions:**
  - Engineering, Product, and Reserach: 50%
  - Business, Strategy, and Operations: 41.8%
  - Data and Analytics: 5.2%
  - Design, Art, and Creative: 4.8%

**Salary:**
  - Average salary posted exceeds $100,000.
  - Engineering, Product, and Reserach has the highest average salary ($121,355)
  - More than 80% of the jobs include salary information.

**Companies:**
  - Dataset contains 245 unique companies. 
  - Most companies report 1-5 open roles, but some companies (7%) report 10+ open roles.

**Job Skills:**
  - Communication skills are one of the most sought-after skills across all job functions.
  - Top technical skills required are AWS, Python, React, Java, C++, and SQL.
            `}
          </ReactMarkdown>
          </div>
        <div className="card" style= {{
                backgroundColor: '#ebf1f5', padding: '10px', width: '32%',
                paddingLeft: '25px',
                borderRadius: '10px',
                lineHeight: '1.3',
                height: '300px'
            }}>
                        <ReactMarkdown>
            {`
**Data and Methodology:**
  - Data sources: cryptojobs.com, web3.career
  - Date range: ${jobFunctionStats.minDate} to ${jobFunctionStats.maxDate}
  - Number of jobs collected: ${jobFunctionStats.totalJobs}
  - Job functions are categorized based on job titles using a combination of keyword matching and LLM. 
  - Locations are mapped to countries using LLM.
  - Skills are based on tags provided by the job poster. 
            `}
          </ReactMarkdown>
        </div>
      </div>
      <br></br>
      <ToggleButton onClick={() => setShowTable(!showTable)} style={{marginLeft: '20px'}}>
          {showTable ? 'Hide Data Table' : 'Show Data Table'}
        </ToggleButton>
      </TitleContainer>
      {showTable && (
          <CleanedTable />
      )}
      <div style={{ justifyContent: 'center', alignItems: 'center', padding: '20px', paddingBottom: '0px', paddingTop: '10px' }}>
        <DataMap />
      </div>
      <div style={{ justifyContent: 'center', alignItems: 'center', padding: '20px', paddingBottom: '0px', paddingTop: '10px' }}>
        <FunctionChart />
      </div>
      <div style={{ justifyContent: 'center', alignItems: 'center', padding: '20px', paddingBottom: '0px', paddingTop: '10px' }}>
        <CompanyChart />
      </div>
      <div style={{ justifyContent: 'center', alignItems: 'center', padding: '20px', paddingBottom: '0px', paddingTop: '10px' }}>
        <SkillsTable />
      </div>

      <div style={{ justifyContent: 'center', alignItems: 'center', padding: '20px', paddingBottom: '0px', paddingTop: '10px' }}>
        <DateChart /> 
      </div>
    </>
  );
}

export default Analysis;
