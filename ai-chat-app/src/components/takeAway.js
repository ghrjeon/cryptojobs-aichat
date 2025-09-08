import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchJobs } from '../utils/fetchJobs';

function TakeAway() {
    const [jobStats, setJobStats] = useState({});
    const [jobfunctionData, setJobfunctionData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companyData, setCompanyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsdata = await fetchJobs();     
                jobsdata.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
      
                const jobStats = {
                    totalJobs: jobsdata.length,
                    minDate: jobsdata.reduce((min, job) => 
                        job.posted_date < min ? job.posted_date : min, 
                        jobsdata[0].posted_date),
                    maxDate: jobsdata.reduce((max, job) => 
                        job.posted_date > max ? job.posted_date : max, 
                        jobsdata[0].posted_date)
                };
      
                // Get jobs with salary info
                const salaryData = jobsdata.filter(job => job.salary_amount > 0);

                // Calculate total jobs per function
                const functionStats = {};
                jobsdata.forEach(job => {
                    const jobfunction = job.job_function;
                    if (jobfunction) {
                        if (!functionStats[jobfunction]) {
                            functionStats[jobfunction] = {
                                count: 0,
                                salarySum: 0,
                                salaryCount: 0
                            };
                        }
                        functionStats[jobfunction].count += 1;
                    }
                });

                // Calculate salary stats
                salaryData.forEach(job => {
                    const jobfunction = job.job_function;
                    if (jobfunction && functionStats[jobfunction]) {
                        functionStats[jobfunction].salarySum += job.salary_amount;
                        functionStats[jobfunction].salaryCount += 1;
                    }
                });

                // Format the data
                const formattedData = Object.entries(functionStats)
                    .map(([jobfunction, stats]) => ({
                        jobfunction,
                        count: stats.count,
                        percentage: Math.round((stats.count / jobStats.totalJobs) * 100),
                        average_salary: stats.salaryCount > 0 
                            ? Math.round(stats.salarySum / stats.salaryCount)
                            : 0,
                        salary_info_percentage: Math.round((stats.salaryCount / stats.count) * 100),
                        jobs_with_salary: stats.salaryCount
                    }))
                    .sort((a, b) => b.count - a.count);

                // Process country data
                const countryCount = {};
                jobsdata.forEach(job => {
                    const country = job.location; 
                    if (country) { 
                        countryCount[country] = (countryCount[country] || 0) + 1;
                    }
                });

                const formattedCountryData = Object.entries(countryCount)
                    .map(([location, count]) => ({ 
                        location, 
                        count, 
                        percentage: ((count / jobsdata.length) * 100).toFixed(1) + '%' 
                    }))
                    .sort((a, b) => b.count - a.count);

                // Process company data
                const companyCount = {};
                jobsdata.forEach(job => {
                    const company = job.company;
                    if (company) {
                        companyCount[company] = (companyCount[company] || 0) + 1;
                    }
                });

                const formattedCompanyData = Object.entries(companyCount)
                    .map(([company, count]) => ({ 
                        company, 
                        count,
                        percentage: ((count / jobsdata.length) * 100).toFixed(1)
                    }))
                    .sort((a, b) => b.count - a.count);

                // Update state with all data
                setJobfunctionData(formattedData);
                setJobStats({
                    ...jobStats,
                    totalCountries: Object.keys(countryCount).length
                });
                setCountryData(formattedCountryData);
                setCompanyData(formattedCompanyData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            }
        };
      
        fetchData();
    }, []);

    const formatCurrency = (amount) => amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    const getJobFunctionData = (functionName) => {
        return jobfunctionData.find(item => item.jobfunction === functionName) || { percentage: 0 };
    };
    
    const highestSalary = jobfunctionData.length > 0 
        ? [...jobfunctionData].sort((a, b) => b.average_salary - a.average_salary)[0] 
        : { jobfunction: '', average_salary: 0 };

    const salaryInfoPercentage = jobfunctionData.length > 0
        ? Math.round(jobfunctionData.reduce((sum, item) => sum + item.jobs_with_salary, 0) / jobStats.totalJobs * 100)
        : 0;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    // Find Remote and US percentages with null checks
    const remotePercentage = countryData.find(item => item.location === 'Remote')?.percentage || '0%';
    const usPercentage = countryData.find(item => item.location === 'United States')?.percentage || '0%';
    
    // Calculate companies with 10+ roles percentage
    const companiesWith10Plus = companyData.filter(item => item.count > 10);
    const percentageWith10Plus = companiesWith10Plus.length > 0 
        ? ((companiesWith10Plus.length / companyData.length) * 100).toFixed(1)
        : '0';

    return (
        <div>
                    <ReactMarkdown>
                        {`
### Dataset
    - Date range: ${jobStats.minDate || 'N/A'} to ${jobStats.maxDate || 'N/A'}
    - Data sources: cryptojobs.com, web3.career
    - Job functions are inferred via LLM methodologies.

### Locations
    - Listings are from ${jobStats.totalCountries || 0} unique countries. 
    - Remote roles make up ${remotePercentage} of the market, followed by US-based positions at ${usPercentage}.

### Listings by Job Functions
    - Engineering, Product, and Research: ${getJobFunctionData('Engineering, Product, and Research').count} (${getJobFunctionData('Engineering, Product, and Research').percentage}%)
    - Business, Strategy, and Operations: ${getJobFunctionData('Business, Strategy, and Operations').count} (${getJobFunctionData('Business, Strategy, and Operations').percentage}%)
    - Data and Analytics: ${getJobFunctionData('Data and Analytics').count} (${getJobFunctionData('Data and Analytics').percentage}%)
    - Design, Art, and Creative: ${getJobFunctionData('Design, Art, and Creative').count} (${getJobFunctionData('Design, Art, and Creative').percentage}%)  

### Average Salary
    - Engineering, Product, and Research: ${formatCurrency(getJobFunctionData('Engineering, Product, and Research').average_salary)}
    - Business, Strategy, and Operations: ${formatCurrency(getJobFunctionData('Business, Strategy, and Operations').average_salary)}
    - Data and Analytics: ${formatCurrency(getJobFunctionData('Data and Analytics').average_salary)}
    - Design, Art, and Creative: ${formatCurrency(getJobFunctionData('Design, Art, and Creative').average_salary)}

### Companies
    - Listings are from ${companyData.length} unique companies. 
    - Most companies report 1-5 open roles, but some companies (${percentageWith10Plus}%) report 10+ open roles.`}
                    </ReactMarkdown>
        </div>
    );
}

export default TakeAway;
