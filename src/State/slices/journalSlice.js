import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, get, push, ref, remove, set } from 'firebase/database';
import { auth, database } from '../../firebase';

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
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');

            const snapshot = await get(child(ref(database), `users/${user.uid}/journal`));
            if (snapshot.exists()) {
                const data = snapshot.val();
                return {
                    entries: data.entries ? Object.values(data.entries) : [],
                    todos: data.todos ? Object.values(data.todos) : [],
                    habits: data.habits ? Object.values(data.habits) : []
                };
            }
            return { entries: [], todos: [], habits: [] };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addEntry = createAsyncThunk(
    'journal/addEntry',
    async (entryData, { rejectWithValue, dispatch }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');

            const newEntryRef = push(child(ref(database), `users/${user.uid}/journal/entries`));
            const newEntry = {
                id: newEntryRef.key,
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                ...entryData,
                userId: user.uid,
                userName: user.displayName
            };

            await set(newEntryRef, newEntry);

            // Safety Check: Flag if necessary
            if (containsBadWords(newEntry.content + ' ' + newEntry.title)) {
                // Save reference to admin node
                await set(ref(database, `admin/flagged_journals/${newEntry.id}`), {
                    ...newEntry,
                    flaggedReason: 'Content Safety'
                });
            }

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
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');

            await update(ref(database, `users/${user.uid}/journal/entries/${id}`), updates);
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
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');

            await remove(ref(database, `users/${user.uid}/journal/entries/${entryId}`));
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
            const snapshot = await get(child(ref(database), 'admin/flagged_journals'));
            if (snapshot.exists()) {
                return Object.values(snapshot.val());
            }
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
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');
            const newRef = push(child(ref(database), `users/${user.uid}/journal/todos`));
            const newTodo = { id: newRef.key, text, completed: false };
            await set(newRef, newTodo);
            return newTodo;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const toggleTodo = createAsyncThunk(
    'journal/toggleTodo',
    async (id, { rejectWithValue, getState }) => {
        try {
            const user = auth.currentUser;
            const todos = getState().journal.todos;
            const todo = todos.find(t => t.id === id);
            if (!todo) throw new Error('Todo not found');

            await update(ref(database, `users/${user.uid}/journal/todos/${id}`), { completed: !todo.completed });
            return id;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const deleteTodo = createAsyncThunk(
    'journal/deleteTodo',
    async (id, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            await remove(ref(database, `users/${user.uid}/journal/todos/${id}`));
            return id;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

// --- Habit Thunks ---
export const addHabit = createAsyncThunk(
    'journal/addHabit',
    async (name, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');
            const newRef = push(child(ref(database), `users/${user.uid}/journal/habits`));
            const newHabit = { id: newRef.key, name, streak: 0, completedDates: [] };
            await set(newRef, newHabit);
            return newHabit;
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const toggleHabit = createAsyncThunk(
    'journal/toggleHabit',
    async ({ id, date }, { rejectWithValue, getState }) => {
        try {
            const user = auth.currentUser;
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

            await update(ref(database, `users/${user.uid}/journal/habits/${id}`), { completedDates, streak: newStreak });
            return { id, completedDates, streak: newStreak };
        } catch (error) { return rejectWithValue(error.message); }
    }
);

export const deleteHabit = createAsyncThunk(
    'journal/deleteHabit',
    async (id, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            await remove(ref(database, `users/${user.uid}/journal/habits/${id}`));
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
