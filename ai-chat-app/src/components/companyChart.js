import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { createClient } from '@supabase/supabase-js';
import DataTable from 'react-data-table-component';
import ReactMarkdown from 'react-markdown';
import { customStyles } from './customStyle';
import { fetchJobs } from '../utils/fetchJobs';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function CompanyChart() {
    const [companyData, setCompanyData] = useState([]);
    const [jobRangeData, setJobRangeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchJobs();

                const companyCount = {};
                fetchedData.forEach(job => {
                    const company = job.company;
                    if (company) {
                        companyCount[company] = (companyCount[company] || 0) + 1;
                    }
                });

                const formattedData = Object.entries(companyCount)
                    .map(([company, count]) => ({ company, count }))
                    .sort((a, b) => b.count - a.count);

                setCompanyData(formattedData);

                // Get job range statistics
                const jobRanges = {
                    '1 job': 0,
                    '2-5 jobs': 0,
                    '6-10 jobs': 0,
                    '11-20 jobs': 0,
                    '20+ jobs': 0
                };

                formattedData.forEach(item => {
                    if (item.count === 1) jobRanges['1 job']++;
                    else if (item.count >= 2 && item.count <= 5) jobRanges['2-5 jobs']++;
                    else if (item.count > 5 && item.count <= 10) jobRanges['6-10 jobs']++;
                    else if (item.count > 10 && item.count <= 20) jobRanges['11-20 jobs']++;
                    else if (item.count > 20) jobRanges['20+ jobs']++;
                });

                const jobRangeArray = Object.entries(jobRanges).map(([range, count]) => ({
                    range,
                    count,
                    percentage: ((count / formattedData.length) * 100).toFixed(1)
                }));

                setJobRangeData(jobRangeArray);
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

    const columns = [
        {
            name: 'Company',
            selector: row => row.company,
            sortable: true,
        },
        {
            name: 'Number of Jobs',
            selector: row => row.count,
            sortable: true,
        },
    ];

    const rangeColumns = [
        {
            name: 'Job Range',
            selector: row => row.range,
            sortable: true,
        },
        {
            name: 'Number of Companies',
            selector: row => row.count,
            sortable: true,
        },
        {
            name: 'Percentage',
            selector: row => row.percentage + '%',
            sortable: true,
        },
    ];

    const barData = [{
        x: companyData.map(item => item.company),
        y: companyData.map(item => item.count),
        type: 'bar',
        text: companyData.map(item => item.count),
        textposition: 'auto',
        hovertext: companyData.map(item => `${item.company}: ${item.count} jobs`),
        marker: {
            color: 'rgb(158,202,225)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    }];

    const layout = {
        title: 'Companies by Job Postings',
        xaxis: {
            tickangle: -45,
            automargin: true
        },
        yaxis: {
            title: 'Number of Jobs'
        },
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 50,
        },
        bargap: 0.2
    };

    const config = {
        displayModeBar: false,
        responsive: true
    };

    const getRangeData = (range) => {
        const data = jobRangeData.find(item => item.range === range);
        return data ? parseFloat(data.percentage) || 0 : 0;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Company Distribution</h2>
            <div className="card-white" style= {{
                width: '65%', 
            }}>          
        <ReactMarkdown>
            {`
- Dataset contains ${companyData.length} unique companies.
- ${getRangeData('1 job')}% of companies have one job posting.
- ${getRangeData('2-5 jobs') + getRangeData('6-10 jobs')}% of companies have 2-10 job postings.
- ${getRangeData('11-20 jobs') + getRangeData('20+ jobs')}% of companies have more than 10 job postings.
- Top 5 companies by number of postings:
   - ${companyData[0].company} (${companyData[0].count}), ${companyData[1].company} (${companyData[1].count}), ${companyData[2].company} (${companyData[2].count}), ${companyData[3].company} (${companyData[3].count}), and ${companyData[4].company} (${companyData[4].count}).
            `}
        </ReactMarkdown>
        </div>
        <br></br>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <DataTable
                        columns={rangeColumns}
                        data={jobRangeData}
                        customStyles={customStyles}
                        pagination={false}
                        sortable
                        dense
                    />
                </div>
                <br></br>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <div style={{ flex: '0 0 715px' }}>
                        <Plot
                            data={barData}
                            layout={layout}
                            config={config}
                            style={{ width: '100%', height: '400px' }}
                        />
                    </div>
                    <div style={{ flex: 2 }}>
                        <DataTable
                            columns={columns}
                            data={companyData}
                            customStyles={customStyles}
                            pagination
                            paginationPerPage={10}
                            sortable
                            dense
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyChart;
