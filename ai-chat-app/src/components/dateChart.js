import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { createClient } from '@supabase/supabase-js';
import DataTable from 'react-data-table-component';
import ReactMarkdown from 'react-markdown';
import { customStyles, functionColors } from './customStyle';
import { fetchJobs } from '../utils/fetchJobs';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function DateChart() {
    const [jobsdata, setData] = useState([]);
    const [jobsByDate, setJobsByDate] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get all jobs
                const fetchedData = await fetchJobs();

                // Group jobs by date and function
                const jobsByDate = {};
                fetchedData.forEach(job => {
                    if (!job.posted_date || !job.job_function) return;
                    
                    // Format date to YYYY-MM-DD
                    const date = new Date(job.posted_date).toISOString().slice(0, 10);
                    // console.log(date)
                    if (!jobsByDate[date]) {
                        jobsByDate[date] = {};
                    }
                    if (!jobsByDate[date][job.job_function]) {
                        jobsByDate[date][job.job_function] = 0;
                    }
                    jobsByDate[date][job.job_function]++;
                });

                setData(fetchedData);
                setJobsByDate(jobsByDate);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
 

    // Create stacked bar chart data
    const dates = Object.keys(jobsByDate).sort();
    const functions = [...new Set(jobsdata.map(job => job.job_function))]
        .filter(Boolean)
        .sort();
    const stackedBarData = functions.map((func, index) => ({
        name: func,
        type: 'bar',
        x: dates,
        y: dates.map(date => jobsByDate[date][func] || 0),
        marker: { color: functionColors[func] || '#808080' }, // Default to gray if no color assigned
        hovertext: dates.map(date => `${date} <br>${func}: ${jobsByDate[date][func] || 0}`),
        hoverinfo: 'label+text',
    }));

    const stackedBarLayout = {
        title: 'Job Counts by Function Over Time',
        barmode: 'stack',
        xaxis: {
            title: 'Posted Date',
            tickangle: -45,
        },
        yaxis: {
            title: 'Number of Jobs',
        },
        margin: {
            l: 60,
            r: 30,
            b: 80,
            t: 50,
        },
        width: 1200,
        height: 500,
        showlegend: true,
        legend: {
            orientation: 'h',
            y: 1.2,
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '100%' }}>
            <h2>Jobs by Date</h2>
            <div className="card-white" style= {{
                width: '50%', 
            }}>
                    <ReactMarkdown>
                    {`
- Postings peak on Tuesday and decrease throughout the week. 
                    `}
                    </ReactMarkdown>
                </div>
                <br></br>
                <div style={{ 
                    width: 'calc(55% - 10px)', 
                    minWidth: '300px'
                }}>
                    <Plot
                        data={stackedBarData}
                        layout={{
                            ...stackedBarLayout,
                            autosize: true,
                        }}
                        config={{
                            responsive: true,
                            displayModeBar: false
                        }}
                        style={{ width: '100%', height: '100%' }}
                        useResizeHandler={true}
                    />
                </div>
            </div>
    );
}

export default DateChart;
