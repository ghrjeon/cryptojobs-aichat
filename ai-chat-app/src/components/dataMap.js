import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import MapErrorBoundary from './MapErrorBoundary';
import { createClient } from '@supabase/supabase-js';
import DataTable from 'react-data-table-component';
import ReactMarkdown from 'react-markdown';
import '../App.css';
import { customStyles, functionColors } from './customStyle';
import { fetchJobs } from '../utils/fetchJobs';


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
                const fetchedData = await fetchJobs();
                
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
            scrollZoom: false,
        },
        dragmode: false,
        width: 715,
        height: 400,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 20,
        }
    };

    const config = {
        displayModeBar: false,
        scrollZoom: false,
        responsive: true,
    };

    return (
        <>
       
        <ReactMarkdown>
            {`
## Jobs by Location
    - Dataset contains listings from ${countryData.length} unique countries.
    - ${countryData.find(item => item.location === 'Remote').percentage} of the jobs are Remote. 
    - ${countryData.find(item => item.location === 'United States').percentage} are in the United States, followed by ${countryData.find(item => item.location === 'United Kingdom').percentage} in the United Kingdom and ${countryData.find(item => item.location === 'India').percentage} in India.`}
          </ReactMarkdown>
        <div style={{ display: 'flex', flexDirection: 'row',gap: '20px' }}>
            <div style={{ flex: '0 0 715px' }}>
                <MapErrorBoundary>
                    {countryData.length > 0 ? (
                        <Plot
                        data={mapData}
                        layout={layout}
                        config={config}
                        style={{ width: '100%', height: '400px' }}
                        onError={(err) => console.error('Plotly Error:', err)}
                        useResizeHandler={true}
                    />
                ) : (
                    <div>Loading map data...</div>
                    )}
                </MapErrorBoundary>
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
