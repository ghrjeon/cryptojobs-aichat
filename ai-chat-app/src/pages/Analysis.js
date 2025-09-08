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

const AnalysisContainer = styled.div`
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #000000;
  font-size: 56px;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const Subtitle = styled.h2`
  color: #000000;
  font-size: 32px;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
`;

const TitleContainer = styled.div`
  padding: 0;
  margin-bottom: 48px;
`;

const ToggleButton = styled.button`
  padding: 12px 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  padding: 32px;
  margin-bottom: 28px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const SubtitleWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 12px 24px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const Arrow = styled.span`
  font-size: 24px;
  margin-right: 12px;
  transform: ${props => props.isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

function Analysis() {
  const [jobFunctionStats, setJobFunctionStats] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [showTakeaways, setShowTakeaways] = useState(true);
  const [showMethodology, setShowMethodology] = useState(true); // Add this state
  const [currentDate] = useState(new Date());

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
    <AnalysisContainer>
      <TitleContainer>
        <Title>Crypto Jobs Analysis</Title>
        <ToggleButton onClick={() => setShowTable(!showTable)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: showTable ? '#f1f1f1' : '#2c3e50',
              color: showTable ? 'black' : 'white',
              fontWeight: showTable ? 'normal' : 'normal',
              whiteSpace: 'nowrap'
          }}>
          {showTable ? 'Hide Data Table' : 'Show Data Table'}
        </ToggleButton>
        <br></br>
        {showTable && (
          <CleanedTable />
      )}
      </TitleContainer>
      
      <SubtitleWrapper onClick={() => setShowTakeaways(!showTakeaways)}>
        <Subtitle style={{ margin: 0 }}>Takeaways ({currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })})</Subtitle> 
        &nbsp;&nbsp;&nbsp; <Arrow isOpen={showTakeaways}>›</Arrow>
      </SubtitleWrapper>

      {showTakeaways && (
        <ChartContainer>
          <TakeAway />
        </ChartContainer>
      )}

      <ChartContainer>
        <DataMap />
      </ChartContainer>

      <ChartContainer>
        <FunctionChart />
      </ChartContainer>

      <ChartContainer>
        <CompanyChart />
      </ChartContainer>

      <ChartContainer>
        <SkillsTable />
      </ChartContainer>

      <ChartContainer>
        <DateChart />
      </ChartContainer>
    </AnalysisContainer>
  );
}

export default Analysis;
