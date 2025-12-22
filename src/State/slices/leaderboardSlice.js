import { createSlice } from '@reduxjs/toolkit';

const generateMockLeaderboard = (type, count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `user-${i + 1}`,
        rank: i + 1,
        name: `Student ${i + 1}`,
        avatar: null, // In a real app, this would be a URL
        level: Math.floor(Math.random() * 50) + 1,
        xp: Math.floor(Math.random() * 10000),
        streak: Math.floor(Math.random() * 100),
        entries: Math.floor(Math.random() * 50),
        toolsUsed: Math.floor(Math.random() * 200),
        communityContrib: Math.floor(Math.random() * 500),
        funzoneScore: Math.floor(Math.random() * 50000),
        badges: Math.floor(Math.random() * 20),
        medals: Math.floor(Math.random() * 10),
        change: Math.random() > 0.5 ? 'up' : 'down', // For trend indicator
        value: Math.floor(Math.random() * 1000) // Generic value for specific tables
    }));
};

const initialState = {
    leaderboards: {
        overall: generateMockLeaderboard('overall'),
        streak: generateMockLeaderboard('streak'),
        xp: generateMockLeaderboard('xp'),
        journal: generateMockLeaderboard('journal'),
        tools: generateMockLeaderboard('tools'),
        community: generateMockLeaderboard('community'),
        funzone: generateMockLeaderboard('funzone'),
        badges: generateMockLeaderboard('badges'),
        medals: generateMockLeaderboard('medals'),
        seasonal: generateMockLeaderboard('seasonal'),
    },
    gameSpecific: {
        'game-1': generateMockLeaderboard('game-1'),
        'game-2': generateMockLeaderboard('game-2'),
    },
    loading: false,
    error: null,
    currentCategory: 'overall',
};

const leaderboardSlice = createSlice({
    name: 'leaderboards',
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.currentCategory = action.payload;
        },
        updateLeaderboard: (state, action) => {
            const { category, data } = action.payload;
            if (state.leaderboards[category]) {
                state.leaderboards[category] = data;
            }
        },
        // Simulate real-time updates or fetching
        fetchLeaderboardStart: (state) => {
            state.loading = true;
        },
        fetchLeaderboardSuccess: (state) => {
            state.loading = false;
        },
        fetchLeaderboardFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { setCategory, updateLeaderboard } = leaderboardSlice.actions;

export const selectLeaderboard = (state, category) => {
    if (category && state.leaderboards.leaderboards[category]) {
        return state.leaderboards.leaderboards[category];
    }
    return state.leaderboards.leaderboards[state.leaderboards.currentCategory];
};

export const selectAllLeaderboards = (state) => state.leaderboards.leaderboards;
export const selectGameLeaderboard = (state, gameId) => state.leaderboards.gameSpecific[gameId];

export default leaderboardSlice.reducer;
