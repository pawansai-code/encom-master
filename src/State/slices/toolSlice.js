import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    history: [],
    favorites: [],
    lastUsed: null,
    usageCount: {}
};

const toolSlice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        recordToolUsage: (state, action) => {
            const toolId = action.payload;
            state.lastUsed = toolId;

            // Add to history if not first
            state.history = [toolId, ...state.history.filter(id => id !== toolId)].slice(0, 10);

            // Increment usage count
            state.usageCount[toolId] = (state.usageCount[toolId] || 0) + 1;
        },
        toggleFavorite: (state, action) => {
            const toolId = action.payload;
            if (state.favorites.includes(toolId)) {
                state.favorites = state.favorites.filter(id => id !== toolId);
            } else {
                state.favorites.push(toolId);
            }
        }
    }
});

export const { recordToolUsage, toggleFavorite } = toolSlice.actions;
export default toolSlice.reducer;
