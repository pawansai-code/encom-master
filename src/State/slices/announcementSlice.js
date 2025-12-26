import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async Thunks

// Fetch Announcements
export const fetchAnnouncements = createAsyncThunk(
    'announcements/fetchAnnouncements',
    async (_, { rejectWithValue }) => {
        try {
            // Mock Fetch
            return [
                { id: '1', title: 'Welcome to Eduverse', description: 'Welcome to our platform!', category: 'System', date: new Date().toISOString() },
                { id: '2', title: 'New Feature', description: 'Check out the new Funzone!', category: 'Update', date: new Date().toISOString() }
            ];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add Announcement (Admin Only)
export const addAnnouncement = createAsyncThunk(
    'announcements/addAnnouncement',
    async (announcementData, { rejectWithValue }) => {
        try {
            return { id: 'mock-announcement-' + Date.now(), ...announcementData, date: new Date().toISOString() };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete Announcement (Admin Only)
export const deleteAnnouncement = createAsyncThunk(
    'announcements/deleteAnnouncement',
    async (id, { rejectWithValue }) => {
        try {
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Edit Announcement (optional, for future)
export const updateAnnouncement = createAsyncThunk(
    'announcements/updateAnnouncement',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return { id, ...data };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const announcementSlice = createSlice({
    name: 'announcements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAnnouncements.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAnnouncements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add
            .addCase(addAnnouncement.fulfilled, (state, action) => {
                state.items.unshift(action.payload); // Add to top
            })
            // Delete
            .addCase(deleteAnnouncement.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            // Update
            .addCase(updateAnnouncement.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...action.payload };
                }
            });
    }
});

export const selectAnnouncements = (state) => state.announcements.items;
export const selectAnnouncementStatus = (state) => state.announcements.status;

export default announcementSlice.reducer;
