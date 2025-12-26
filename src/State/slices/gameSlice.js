import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const defaultGames = [
    { id: 'snake', name: 'Neon Snake', category: 'Arcade', status: 'active', plays: 1240, rating: 4.8 },
    { id: 'memory', name: 'Memory Master', category: 'Puzzle', status: 'active', plays: 2100, rating: 4.9 },
    { id: 'code-breaker', name: 'Code Breaker', category: 'Puzzle', status: 'active', plays: 500, rating: 4.7 },
    { id: 'tic-tac-toe', name: 'Tic Tac Toe', category: 'Classic', status: 'active', plays: 3000, rating: 4.2 },
    { id: 'trivia', name: 'Ninja Trivia', category: 'Education', status: 'active', plays: 1500, rating: 4.5 },
    { id: 'typing', name: 'Speed Typer', category: 'Skill', status: 'maintenance', plays: 800, rating: 4.6 },
    { id: 'chess-lite', name: 'Chess Lite', category: 'Strategy', status: 'active', plays: 600, rating: 4.9 }
];

// Async Thunks
export const fetchGames = createAsyncThunk(
    'games/fetchGames',
    async (_, { rejectWithValue }) => {
        try {
            // Mock Fetch Games
            return defaultGames;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleGameStatus = createAsyncThunk(
    'games/toggleStatus',
    async ({ id, currentStatus }, { rejectWithValue }) => {
        try {
            const newStatus = currentStatus === 'active' ? 'maintenance' : 'active';
            // Mock toggle
            return { id, status: newStatus };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteGame = createAsyncThunk(
    'games/deleteGame',
    async (id, { rejectWithValue }) => {
        try {
            // Mock Delete
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    games: [], // List of available games and their status
    leaderboards: {
        'tic-tac-toe': [],
        'memory': [],
        'snake': [],
        'trivia': [],
        'typing': []
    },
    recentScores: [],
    status: 'idle',
    error: null
};

const gameSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        submitScore: (state, action) => {
            const { gameId, user, score } = action.payload;

            // Add to leaderboards
            if (!state.leaderboards[gameId]) {
                state.leaderboards[gameId] = [];
            }
            state.leaderboards[gameId].push({
                user: user || 'Anonymous',
                score,
                date: new Date().toISOString().split('T')[0]
            });

            // Sort leaderboard (descending for score) - Simple logic
            state.leaderboards[gameId].sort((a, b) => b.score - a.score);
            state.leaderboards[gameId] = state.leaderboards[gameId].slice(0, 5); // Keep top 5

            // Add to recent scores
            state.recentScores.unshift({ gameId, score, date: new Date().toISOString() });
            state.recentScores = state.recentScores.slice(0, 10);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGames.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.games = action.payload;
            })
            .addCase(toggleGameStatus.fulfilled, (state, action) => {
                const game = state.games.find(g => g.id === action.payload.id);
                if (game) game.status = action.payload.status;
            })
            .addCase(deleteGame.fulfilled, (state, action) => {
                state.games = state.games.filter(g => g.id !== action.payload);
            });
    }
});

export const { submitScore } = gameSlice.actions;
export default gameSlice.reducer;
