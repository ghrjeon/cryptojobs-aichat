import DataTable from 'react-data-table-component';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { customStyles } from './customStyle';
import { fetchJobs } from '../utils/fetchJobs';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function CleanedTable() {
    const [jobsdata, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFunction, setSelectedFunction] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchQueryTable, setSearchQueryTable] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsdata = await fetchJobs();
                jobsdata.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
                setData(jobsdata);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { name: 'Title', selector: row => row.title, sortable: true ,
            grow: 3, 

        },
        { name: 'Company', selector: row => row.company, sortable: true },
        { name: 'Location', selector: row => row.location, sortable: true },
        { name: 'Function', selector: row => row.job_function, sortable: true, 
            grow: 2.5,  
        },
        { 
            name: 'Salary', 
            selector: row => row.salary_amount,
            format: row => row.salary_amount ? row.salary_amount.toLocaleString() : '-',
            sortable: true 
        },
        // { 
        //     name: 'Skills', 
        //     selector: row => {
        //         const skillsArray = typeof row.skills === 'string' ? 
        //             JSON.parse(row.skills) : row.skills;
        //         return skillsArray.join(', ');  // Simple comma-separated list
        //     },
        //     sortable: true,
        // },
        { 
            name: 'Source', 
            selector: row => (
                <a 
                    href={row.job_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                        color: '#0066cc',
                        cursor: 'pointer'
                    }}
                >
                    {row.source}
                </a>
            ), 
            sortable: true 
        },
        { name: 'Posted Date', selector: row => row.posted_date, sortable: true },
    ];

    const job_functions = 
    [
      "Engineering, Product, and Research",
      "Business, Strategy, and Operations",
      "Data and Analytics",
      "Design, Art, and Creative"
    ]

    const locations = [...new Set(jobsdata.map(row => row.location))].sort((a, b) => a.localeCompare(b));
    const companies = [...new Set(jobsdata.map(row => row.company))].sort((a, b) => a.localeCompare(b));
    const filteredTable = jobsdata.filter(row => 
        row.title.toLowerCase().includes(searchQueryTable.toLowerCase()) && 
        (selectedFunction === '' || row.job_function === selectedFunction) &&
        (selectedLocation === '' || row.location === selectedLocation) &&
        (selectedCompany === '' || row.company === selectedCompany)
    );

    return (
        <div style={{ 
            width: '90%',
            margin: 'auto'
        }}>
            <br></br>
         {/* First Filter: Job Function */}
          <select 
          value={selectedFunction} 
          onChange={(e) => setSelectedFunction(e.target.value)}
            >
          <option value="">Sort by Job Function</option>
          {job_functions.map((job_function, index) => (
              <option key={index} value={job_function}>{job_function}</option>
          ))}
         </select>
         {/* Third Filter: Company */}
                  <select 
          value={selectedCompany} 
          onChange={(e) => setSelectedCompany(e.target.value)}
            >
          <option value="">Sort by Company</option>
          {companies.map((company, index) => (
              <option key={index} value={company}>{company}</option>
          ))}
         </select>
         {/* Second Filter: Location */}
         <select 
          value={selectedLocation} 
          onChange={(e) => setSelectedLocation(e.target.value)}
            >
          <option value="">Sort by Location</option>
          {locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
          ))}
         </select>

            <input 
                type="text" 
                placeholder="Search job titles..." 
                value={searchQueryTable} 
                onChange={(e) => setSearchQueryTable(e.target.value)}
            />
            <div className="table-container" style={{ margin: 'auto', width: '100%' }}>
                <DataTable
                    columns={columns}
                    data={filteredTable}
                    progressPending={loading}
                    customStyles={customStyles}
                    pagination
                    dense
                    style={{ width: '80vw' }}
                />
            </div>
            {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
            <br></br>
        </div>
    );
}

export default CleanedTable;