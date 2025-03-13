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
        // console.log("data here************")
        // console.log(data)
        const code = data.result.code;
        const type = data.result.type;
        const value = data.result.value;
        return { code, type, value };

        // return data.result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Reset conversation if needed
export const resetConversation = () => {
    conversationHistory = [];
};

