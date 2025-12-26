import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Helper to filter bad words
const BAD_WORDS = ['badword', 'abuse', 'hate', 'kill']; // Example list
const containsBadWords = (text) => {
    return BAD_WORDS.some(word => text.toLowerCase().includes(word));
};

// Async Thunks

export const fetchJournal = createAsyncThunk(
    'journal/fetch',
    async (_, { rejectWithValue }) => {
        try {
            // Mock Fetch Journal
            return {
                entries: [],
                todos: [],
                habits: []
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addEntry = createAsyncThunk(
    'journal/addEntry',
    async (entryData, { rejectWithValue, dispatch }) => {
        try {
            const newEntry = {
                id: 'mock-entry-' + Date.now(),
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                ...entryData,
                userId: 'mock-user-id',
                userName: 'Ninja Student'
            };

            return newEntry;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateEntry = createAsyncThunk(
    'journal/updateEntry',
    async ({ id, ...updates }, { rejectWithValue }) => {
        try {
            // Mock Update Entry
            return { id, ...updates };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteEntry = createAsyncThunk(
    'journal/deleteEntry',
    async (entryId, { rejectWithValue }) => {
        try {
            // Mock Delete Entry
            return entryId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Admin Action: Fetch Flagged Entries
export const fetchFlaggedEntries = createAsyncThunk(
    'journal/fetchFlagged',
    async (_, { rejectWithValue }) => {
        try {
            // Mock Fetch Flagged
            return [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// --- Todo Thunks ---
export const addTodo = createAsyncThunk(
    'journal/addTodo',
    async (text, { rejectWithValue }) => {
        try {
            const newTodo = { id: 'mock-todo-' + Date.now(), text, completed: false };
            return newTodo;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const toggleTodo = createAsyncThunk(
    'journal/toggleTodo',
    async (id, { rejectWithValue, getState }) => {
        try {
            return id;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const deleteTodo = createAsyncThunk(
    'journal/deleteTodo',
    async (id, { rejectWithValue }) => {
        try {
            return id;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

// --- Habit Thunks ---
export const addHabit = createAsyncThunk(
    'journal/addHabit',
    async (name, { rejectWithValue }) => {
        try {
            const newHabit = { id: 'mock-habit-' + Date.now(), name, streak: 0, completedDates: [] };
            return newHabit;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const toggleHabit = createAsyncThunk(
    'journal/toggleHabit',
    async ({ id, date }, { rejectWithValue, getState }) => {
        try {
            const habits = getState().journal.habits;
            const habit = habits.find(h => h.id === id);
            if (!habit) throw new Error('Habit not found');

            const completedDates = habit.completedDates ? [...habit.completedDates] : [];
            const index = completedDates.indexOf(date);
            let newStreak = habit.streak;

            if (index === -1) {
                completedDates.push(date);
                newStreak += 1;
            } else {
                completedDates.splice(index, 1);
                newStreak = Math.max(0, newStreak - 1);
            }
            return { id, completedDates, streak: newStreak };
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const deleteHabit = createAsyncThunk(
    'journal/deleteHabit',
    async (id, { rejectWithValue }) => {
        try {
            return id;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

const initialState = {
    entries: [],
    flaggedEntries: [], // For Admin
    todos: [],
    habits: [],
    status: 'idle',
    error: null
};

const journalSlice = createSlice({
    name: 'journal',
    initialState,
    reducers: {
        // Optimistic UI updates could go here
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJournal.fulfilled, (state, action) => {
                state.entries = action.payload.entries;
                state.todos = action.payload.todos;
                state.habits = action.payload.habits;
                state.status = 'succeeded';
            })
            .addCase(addEntry.fulfilled, (state, action) => {
                state.entries.unshift(action.payload);
            })
            .addCase(updateEntry.fulfilled, (state, action) => {
                const index = state.entries.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    state.entries[index] = { ...state.entries[index], ...action.payload };
                }
            })
            .addCase(deleteEntry.fulfilled, (state, action) => {
                state.entries = state.entries.filter(e => e.id !== action.payload);
            })
            .addCase(fetchFlaggedEntries.fulfilled, (state, action) => {
                state.flaggedEntries = action.payload;
            })
            // Todos
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todos.push(action.payload);
            })
            .addCase(toggleTodo.fulfilled, (state, action) => {
                const t = state.todos.find(i => i.id === action.payload);
                if (t) t.completed = !t.completed;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter(i => i.id !== action.payload);
            })
            // Habits
            .addCase(addHabit.fulfilled, (state, action) => {
                state.habits.push(action.payload);
            })
            .addCase(toggleHabit.fulfilled, (state, action) => {
                const h = state.habits.find(i => i.id === action.payload.id);
                if (h) {
                    h.completedDates = action.payload.completedDates;
                    h.streak = action.payload.streak;
                }
            })
            .addCase(deleteHabit.fulfilled, (state, action) => {
                state.habits = state.habits.filter(i => i.id !== action.payload);
            });
    }
});

export default journalSlice.reducer;
