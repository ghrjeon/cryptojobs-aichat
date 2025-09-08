import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { createClient } from '@supabase/supabase-js';
import DataTable from 'react-data-table-component';
import ReactMarkdown from 'react-markdown';
import '../App.css';
import { customStyles, functionColors } from './customStyle';
import { fetchJobs } from '../utils/fetchJobs';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


function FunctionChart() {
    const [jobfunctionData, setJobfunctionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchJobs();

                // Get jobs with salary info
                const salaryData = fetchedData.filter(job => job.salary_amount > 0);

                // Calculate total jobs
                const totalJobs = fetchedData.length;

                // Calculate total jobs per function
                const jobFunctionStats = {};
                fetchedData.forEach(job => {
                    const jobfunction = job.job_function;
                    if (jobfunction) {
                        if (!jobFunctionStats[jobfunction]) {
                            jobFunctionStats[jobfunction] = {
                                count: 0,
                                salarySum: 0,
                                salaryCount: 0
                            };
                        }
                        jobFunctionStats[jobfunction].count += 1;
                    }
                });

                // Calculate salary stats
                salaryData.forEach(job => {
                    const jobfunction = job.job_function;
                    if (jobfunction && jobFunctionStats[jobfunction]) {
                        jobFunctionStats[jobfunction].salarySum += job.salary_amount;
                        jobFunctionStats[jobfunction].salaryCount += 1;
                    }
                });

                // Format the data
                const formattedData = Object.entries(jobFunctionStats)
                    .map(([jobfunction, stats]) => ({
                        jobfunction,
                        count: stats.count,
                        percentage: Math.round((stats.count / totalJobs) * 100),
                        average_salary: stats.salaryCount > 0 
                            ? Math.round(stats.salarySum / stats.salaryCount)
                            : 0,
                        salary_info_percentage: Math.round((stats.salaryCount / stats.count) * 100),
                        jobs_with_salary: stats.salaryCount
                    }))
                    .sort((a, b) => b.count - a.count);

                setJobfunctionData(formattedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    // Format currency
    const formatCurrency = (amount) => amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    // Get job function data
    const getJobFunctionData = (functionName) => {
        return jobfunctionData.find(item => item.jobfunction === functionName);
    };


    const columns = [
        {
            name: 'Job Function',
            selector: row => row.jobfunction,
            sortable: true,
            grow: 2
        },

        {
            name: 'Total Jobs',
            selector: row => row.count,
            sortable: true,
        },
        {
            name: 'Percentage',
            selector: row => row.percentage,
            sortable: true,
            format: row => `${row.percentage}%`
        },
        {
            name: 'Average Salary',
            selector: row => row.average_salary,
            sortable: true,
            format: row => row.average_salary > 0 
                ? formatCurrency(row.average_salary)
                : 'No salary data'
        },
        {
            name: 'Jobs with Salary',
            selector: row => row.jobs_with_salary,
            sortable: true,
        },
        {
            name: 'Salary Info %',
            selector: row => row.salary_info_percentage,
            sortable: true,
            format: row => `${row.salary_info_percentage}%`
        }
    ];

    const pieData = [{
        values: jobfunctionData.map(item => item.count),
        labels: jobfunctionData.map(item => item.jobfunction),
        type: 'pie',
        text: jobfunctionData.map(item => item.count),
        textposition: 'auto',
        textfont: {
            color: 'black',
            size: 12,
            weight: 500
        },
        hoverinfo: 'label+text+percent',
        marker: {
            colors: jobfunctionData.map(item => functionColors[item.jobfunction] || '#808080'),  
        },
    }];

    const barData = [{
        x: jobfunctionData.map(item => item.jobfunction),
        y: jobfunctionData.map(item => item.average_salary),
        type: 'bar',
        text: jobfunctionData.map(item => formatCurrency(item.average_salary)),
        textposition: 'auto',
        hovertext: jobfunctionData.map(item => `${item.jobfunction}: ${formatCurrency(item.average_salary)}`),
        hoverinfo: 'label+text',
        marker: {
            color: jobfunctionData.map(item => functionColors[item.jobfunction] || '#808080'), 
            opacity: 0.8
        },
    }];

    const pieLayout = {
        title: 'Job Functions Distribution',
        margin: {
            l: 30,
            r: 30,
            b: 50,
            t: 50,
        },
        showlegend: true,
        width: 600,
        height: 400
    };

    const barLayout = {
        title: 'Average Salary by Job Function',
        xaxis: {
            showticklabels: false,  // Hide x-axis labels
            showgrid: false,        
        },
        yaxis: {
            title: 'Average Salary',
            automargin: true,
            tickformat: '$,.0f'    // Format y-axis ticks as currency
        },
        margin: {
            l: 50,
            r: 30,
            b: 30,
            t: 50,
        },
        width: 550,
        height: 400,
        showlegend: false  // Hide legend since it's shown in pie chart
    };

    const highestsalary = jobfunctionData.sort((a, b) => b.average_salary - a.average_salary)[0];

    return (
        <div style={{ padding: '0px' }}>
            <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
          <ReactMarkdown>
          {`
## Job Function
    - ${getJobFunctionData('Engineering, Product, and Research').percentage}% of jobs are in Engineering, Product, and Research.
    - ${getJobFunctionData('Business, Strategy, and Operations').percentage}% are in Business, Strategy, and Operations.
    - ${getJobFunctionData('Data and Analytics').percentage}% are in Data and Analytics.
    - ${getJobFunctionData('Design, Art, and Creative').percentage}% are in Design, Art, and Creative.
                            `}
          </ReactMarkdown>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>

          <ReactMarkdown>
            {`
## Job Function Salary
    - The average salary for crypto job postings exceeds $100,000.
    - ${highestsalary.jobfunction} is the highest paying job function at ${formatCurrency(highestsalary.average_salary)}.
    - ${getJobFunctionData('Engineering, Product, and Research').salary_info_percentage}% of jobs in Engineering, Product, and Research include salary information.
    - ${getJobFunctionData('Design, Art, and Creative').salary_info_percentage}% of jobs in Design, Art, and Creative include salary information.
            `}
          </ReactMarkdown>
          </div>
        <br></br>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px'}}>
                <div>
                    <DataTable
                        columns={columns}
                        data={jobfunctionData}
                        customStyles={customStyles}
                        paginationPerPage={10}
                        sortable
                        dense
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0px', justifyContent: 'center' }}>
                    <Plot
                        data={pieData}
                        layout={pieLayout}
                    />
                    <Plot
                        data={barData}
                        layout={barLayout}
                    />
                </div>
            </div>
        </div>
    );
}

export default FunctionChart;
