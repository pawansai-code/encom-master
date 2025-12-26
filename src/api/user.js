import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

// Get current user profile
export const getUserProfile = async (token) => {
    return await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Log activity (Play game, use tool) to earn XP
export const logUserActivity = async (token, activityData) => {
    return await axios.post(`${API_URL}/activity`, activityData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
