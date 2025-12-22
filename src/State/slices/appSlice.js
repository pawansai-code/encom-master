import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    language: 'en',
    activePage: 'home',
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setActivePage: (state, action) => {
            state.activePage = action.payload;
        },
    },
});

export const { setLanguage, setActivePage } = appSlice.actions;

export default appSlice.reducer;
