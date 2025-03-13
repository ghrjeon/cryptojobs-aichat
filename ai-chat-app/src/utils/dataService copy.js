// import OpenAI from 'openai';

const API_URL = 'http://localhost:5001/api';

// Keep track of conversation history
let conversationHistory = [];

export const searchData = async (input, previousMessages = []) => {
    try {
        // Format messages for the API
        const messages = [
            ...previousMessages,
            { role: 'user', content: input }
        ];

        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: input }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.result.value;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Reset conversation if needed
export const resetConversation = () => {
    conversationHistory = [];
};

// Add new functions for direct job data access
export const searchJobs = async (params) => {
    const response = await fetch(`${API_URL}/jobs/search?${new URLSearchParams(params)}`);
    if (!response.ok) throw new Error('Failed to search jobs');
    return response.json();
};

export const getJobStats = async () => {
    const response = await fetch(`${API_URL}/jobs/stats`);
    if (!response.ok) throw new Error('Failed to get job statistics');
    return response.json();
};

export const getJobById = async (id) => {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    if (!response.ok) throw new Error('Failed to get job details');
    return response.json();
}; 