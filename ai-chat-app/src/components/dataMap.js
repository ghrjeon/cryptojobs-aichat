import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { createClient } from '@supabase/supabase-js';
import DataTable from 'react-data-table-component';
import ReactMarkdown from 'react-markdown';
import '../App.css';
import { customStyles, functionColors } from './customStyle';


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


function DataMap() {
    const [jobsdata, setData] = useState([]);
    const [countryData, setCountryData] = useState([]); // New state for formatted data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: fetchedData, error } = await supabase
                    .from('jobs_clean')
                    .select('*')
                    .gte('posted_date', '2025-03-01');

                if (error) throw error;

                // Group jobs by country and count them
                const countryCount = {};
                fetchedData.forEach(job => {
                    const country = job.location; 
                    if (country) { 
                        countryCount[country] = (countryCount[country] || 0) + 1;
                    }
                });

                const formattedData = Object.entries(countryCount)
                    .map(([location, count]) => ({ location, count, percentage: ((count / fetchedData.length) * 100).toFixed(1) + '%' }))
                    .sort((a, b) => b.count - a.count);

                                setData(fetchedData);
                                setCountryData(formattedData);
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
            name: 'Country',
            selector: row => row.location,
            sortable: true,
        },
        {
            name: 'Number of Jobs',
            selector: row => row.count,
            sortable: true,
        },
        {
            name: 'Percentage',
            selector: row => row.percentage,
            sortable: true,
        }
    ];

    const mapData = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: countryData.map(item => item.location),
        z: countryData.map(item => item.count),
        text: countryData.map(item => `${item.location}: ${item.count} jobs`),
        colorscale: 'd10',
        colorbar: {
            title: 'Number of Jobs',
            thickness: 20
        },
        marker: {
            line: {
                color: 'rgb(255,255,255)',
                width: 1
            }
        }
    }];

    const layout = {
        title: 'Global Job Distribution',
        geo: {
            scope: 'world',
            showframe: false,
            showcoastlines: true,
            projection: {
                type: 'equirectangular'
            },
            showland: true,
            landcolor: 'rgb(243, 243, 243)',
            countrycolor: 'rgb(204, 204, 204)',
        },
        width: 715,
        height: 400,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 30,
        }
    };

    return (
        <>
        <h2>Jobs by Location</h2>
        <div className="card-white" style= {{
                width: '65%', 
            }}>          
        <ReactMarkdown>
            {`
- Dataset contains listings from ${countryData.length} unique countries.
- ${countryData.find(item => item.location === 'Remote').percentage} of the jobs are Remote. 
- ${countryData.find(item => item.location === 'United States').percentage} are in the United States, followed by ${countryData.find(item => item.location === 'United Kingdom').percentage} in the United Kingdom and ${countryData.find(item => item.location === 'India').percentage} in India.
            `}
          </ReactMarkdown>
        </div>
        <br></br>
        <div style={{ display: 'flex', flexDirection: 'row',gap: '20px' }}>
            <div style={{ flex: '0 0 715px' }}>
                <Plot
                    data={mapData}
                    layout={layout}
                    style={{ width: '100%', height: '400px' }}
                />
            </div>
            <div style={{ flex: 2 }}>
                <DataTable
                    columns={columns}
                    data={countryData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={10}
                    sortable
                    dense
                />
            </div>
        </div>
        </>
    );
}

export default DataMap;
