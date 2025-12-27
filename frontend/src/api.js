const BASE_URL = 'http://localhost:3000';

export const fetchInternships = async () => {
    console.log('Fetching internships from backend...');
    const response = await fetch(`${BASE_URL}/internships`);
    if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
    }
    const data = await response.json();
    console.log('Internships received:', data);
    return data;
};

export const fetchMatchingInternships = async () => {
    try {
        const response = await fetch(`${BASE_URL}/matching_internships`);
        if (!response.ok) {
            throw new Error(`Failed to fetch matching internships. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching matching internships:', error);
        throw error;
    }
};
