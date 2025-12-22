import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, get, ref, remove, update } from 'firebase/database';
import { database } from '../../firebase';

const defaultGames = [
    { id: 'g1', name: 'Neon Snake', category: 'Arcade', status: 'active', plays: 1240, rating: 4.8 },
    { id: 'g2', name: 'Math Blaster', category: 'Educational', status: 'active', plays: 890, rating: 4.5 },
    { id: 'g3', name: 'Memory Ninja', category: 'Puzzle', status: 'active', plays: 2100, rating: 4.9 },
    { id: 'g4', name: 'Space Typing', category: 'Educational', status: 'maintenance', plays: 540, rating: 4.2 },
];

// Async Thunks
export const fetchGames = createAsyncThunk(
    'games/fetchGames',
    async (_, { rejectWithValue }) => {
        try {
            const snapshot = await get(child(ref(database), 'config/games'));
            if (snapshot.exists()) {
                const gamesObj = snapshot.val();
                return Object.values(gamesObj); // Convert {g1: {..}, g2: {..}} to array
            } else {
                // Seed initial data if empty
                const updates = {};
                defaultGames.forEach(game => {
                    updates['config/games/' + game.id] = game;
                });
                await update(ref(database), updates);
                return defaultGames;
            }
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
            await update(ref(database, `config/games/${id}`), { status: newStatus });
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
            await remove(ref(database, `config/games/${id}`));
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
