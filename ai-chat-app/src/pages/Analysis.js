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
import { fetchJobs } from '../utils/fetchJobs';
import TakeAway from '../components/takeAway';
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

        const jobsdata = await fetchJobs();     
        jobsdata.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));

        const jobStats = {
          totalJobs:  jobsdata.length,
          minDate: jobsdata.reduce((min, job) => 
            job.posted_date < min ? job.posted_date : min, 
            jobsdata[0].posted_date),
          maxDate: jobsdata.reduce((max, job) => 
            job.posted_date > max ? job.posted_date : max, 
            jobsdata[0].posted_date)
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
        <ToggleButton onClick={() => setShowTable(!showTable)} style={{marginLeft: '20px'}}>
          {showTable ? 'Hide Data Table' : 'Show Data Table'}
        </ToggleButton>
      </TitleContainer>
      {showTable && (
          <CleanedTable />
      )}
      <div style={{ justifyContent: 'center', alignItems: 'center', padding: '20px', paddingBottom: '0px', paddingTop: '10px' }}>
        <TakeAway />
      </div>
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
