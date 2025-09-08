import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DataTable from 'react-data-table-component';
import ReactMarkdown from 'react-markdown';
import { customStyles } from './customStyle';
import { fetchSkills } from '../utils/fetchJobs';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const jobFunctions = ['Engineering, Product, and Research', 
    'Business, Strategy, and Operations', 
    'Design, Art, and Creative',
    'Data and Analytics',
    ];

function SkillsTable() {
    const [skillsData, setSkillsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFunction, setActiveFunction] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchSkills();

                const filteredData = fetchedData.filter(job => 
                    jobFunctions.includes(job.job_function)
                );

                // Process skills by job function
                const skillsByFunction = {};
                filteredData.forEach(job => {
                    if (!job.skills || !job.job_function) return;
                    
                    const skillsArray = typeof job.skills === 'string' 
                        ? JSON.parse(job.skills) 
                        : job.skills;

                    if (!skillsByFunction[job.job_function]) {
                        skillsByFunction[job.job_function] = {};
                    }

                    skillsArray.forEach(skill => {
                        skillsByFunction[job.job_function][skill] = 
                            (skillsByFunction[job.job_function][skill] || 0) + 1;
                    });
                });

                // Convert to table format
                const processedData = {};
                Object.entries(skillsByFunction).forEach(([jobFunction, skills]) => {
                    const sortedSkills = Object.entries(skills)
                        .sort(([, a], [, b]) => b - a)
                        .map(([skill, count], index) => ({
                            id: index + 1,
                            skill: skill,
                            count: count
                        }));
                    
                    processedData[jobFunction] = sortedSkills;
                });

                setSkillsData(processedData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Set initial active function for Navigation Tabs
    if (!activeFunction && Object.keys(skillsData).length > 0) {
        setActiveFunction(Object.keys(skillsData)[0]);
    }

    const columns = [
        {
            name: 'Rank',
            selector: row => row.id,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Skill',
            selector: row => row.skill,
            sortable: true,
            grow: 2,
        },
        {
            name: 'Count',
            selector: row => row.count,
            sortable: true,
            width: '150px',
        },
    ];

    return (
        <div>
        <h2>Top Skills by Job Function</h2>
            {/* Navigation Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '0px',
                overflowX: 'auto',
                padding: '10px 0'
            }}>
                {Object.keys(skillsData).map(jobFunction => (
                    <button
                        key={jobFunction}
                        onClick={() => setActiveFunction(jobFunction)}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            backgroundColor: activeFunction === jobFunction ? '#2c3e50' : '#f1f1f1',
                            color: activeFunction === jobFunction ? 'white' : 'black',
                            fontWeight: activeFunction === jobFunction ? 'bold' : 'normal',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {jobFunction}
                    </button>
                ))}
            </div>
            <div style={{display: 'flex', flexDirection: 'row', gap: '20px', 
                margin: '10px',
            }}>
            {/* Active Table */}
            {activeFunction && (
                <div style={{width: '55%' }}>
                    <h2>{activeFunction}</h2>
                    <DataTable
                        columns={columns}
                        data={skillsData[activeFunction]}
                        customStyles={customStyles}
                        pagination
                        paginationPerPage={10}
                        dense
                        striped
                    />
                </div>
            )}
            <div style={{width: '55%', overflow: 'auto'}}>
           <br></br>
            <ReactMarkdown>
         {`
    - Communication Skills is one of the most required skills across all job functions.
    - Many companies list soft skills even for technical roles.
    - Top technical skills include AWS, Database Management, Python, React, Java, C++, and SQL.
                `}
                </ReactMarkdown>
            </div>
             </div> 
        </div>
    );
}

export default SkillsTable;
