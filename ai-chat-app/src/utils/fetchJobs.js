import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchJobs = async () => {
    const jobsdata = [];
    for (let i = 0; i < 5000; i += 1000) {
        const { data: jobsdata_i, error_i } = await supabase
        .from('jobs_clean')
    .select('*')
    .gte('posted_date', '2025-03-01')  
    .range(i, i+999);                  
    if (error_i) throw error_i;
    
    // Add check for empty results to exit early
    if (!jobsdata_i || jobsdata_i.length === 0) {
        break;  // No more data to fetch
    }
    jobsdata.push(...jobsdata_i);
    }
    jobsdata.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    return jobsdata;    
}

export const fetchSkills = async () => {
    const skillsdata = [];
    for (let i = 0; i < 5000; i += 1000) {
        const { data: skillsdata_i, error_i } = await supabase
        .from('jobs_clean')
        .select('skills, job_function')
        .gte('posted_date', '2025-03-01')
        .range(i, i+999)
        .match({source: 'cryptojobs.com'});
        if (error_i) throw error_i;
        skillsdata.push(...skillsdata_i);
    }
    return skillsdata;
}