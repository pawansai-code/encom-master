import { createSlice } from '@reduxjs/toolkit';

const initialCategoryState = {
    current: 0,
    longest: 0,
    lastActive: null,
    history: {} // Map of date -> intensity/count
};

const initialState = {
    login: { ...initialCategoryState, current: 5, longest: 14, lastActive: '2024-12-11' },
    tools: { ...initialCategoryState, current: 2, longest: 5, lastActive: '2024-12-12' },
    journal: { ...initialCategoryState, current: 3, longest: 10, lastActive: '2024-12-10' },
    community: { ...initialCategoryState, current: 0, longest: 2, lastActive: '2024-12-08' },
    funzone: { ...initialCategoryState, current: 1, longest: 6, lastActive: '2024-12-12' },
    combinedScore: 0
};

// Helper to calculate score
const calculateScore = (state) => {
    let score = 0;
    const categories = ['login', 'tools', 'journal', 'community', 'funzone'];
    categories.forEach(cat => {
        score += state[cat].current * 10;
        score += state[cat].longest * 5;
    });
    return score;
};

const streakSlice = createSlice({
    name: 'streaks',
    initialState,
    reducers: {
        updateStreak: (state, action) => {
            const { type, date } = action.payload; // type: 'login', 'tools', etc.
            if (!state[type]) return;

            const category = state[type];

            // If already active today, just increment intensity
            if (category.lastActive === date) {
                category.history[date] = (category.history[date] || 0) + 1;
                return;
            }

            // Check if consecutive
            const lastDate = new Date(category.lastActive);
            const newDate = new Date(date);
            const diffTime = Math.abs(newDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1 || !category.lastActive) {
                // Streak continues
                category.current += 1;
                if (category.current > category.longest) {
                    category.longest = category.current;
                }
            } else if (diffDays > 1) {
                // Streak broken
                category.current = 1;
            }

            category.lastActive = date;
            category.history[date] = 1;
            state.combinedScore = calculateScore(state);
        },
        resetStreak: (state, action) => {
            const { type } = action.payload;
            if (state[type]) state[type].current = 0;
            state.combinedScore = calculateScore(state);
        }
    }
});

export const { updateStreak, resetStreak } = streakSlice.actions;
export default streakSlice.reducer;
