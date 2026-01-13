import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const defaultUserState = {
    streaks: {
        login: { current: 1, longest: 5, lastActive: new Date().toISOString(), history: {} },
        tools: { current: 0, longest: 0, lastActive: null, history: {} },
        journal: { current: 0, longest: 0, lastActive: null, history: {} },
        community: { current: 0, longest: 0, lastActive: null, history: {} },
        funzone: { current: 0, longest: 0, lastActive: null, history: {} },
        combinedScore: 0
    },
    journal: {
        entries: [],
        todos: [],
        habits: []
    },
    rewards: {
        coins: 1500,
        points: 500,
        level: 5,
        xp: 2500,
        unlockedTitles: ['Novice', 'Apprentice'],
        currentTitle: 'Apprentice',
        badges: [],
        medals: []
    },
    wallet: {
        balance: 50.00,
        transactions: []
    },
    activityLog: [],
    role: 'student',
    settings: {
        theme: 'light',
        notifications: true
    },
    achievements: [] // For storing sticker objects
};

const mockUser = {
    uid: 'mock-user-123',
    email: 'student@eduverse.com',
    role: 'student',
    data: {
        ...defaultUserState,
        name: 'Ninja Student',
        role: 'student',
        email: 'student@eduverse.com'
    }
};

// Mock Login - Just for structural integrity if needed
export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        // Return mock user immediately
        return mockUser;
    }
);

export const signupUser = createAsyncThunk(
    'user/signup',
    async (data, { rejectWithValue }) => {
        return {
            ...mockUser,
            email: data.email,
            data: { ...mockUser.data, name: data.username, email: data.email }
        };
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { dispatch }) => {
        return null;
    }
);

export const signupAdmin = createAsyncThunk(
    'user/signupAdmin',
    async (data, { rejectWithValue }) => {
        return mockUser; // Mock behavior
    }
);

export const verifyAdmin = createAsyncThunk(
    'user/verifyAdmin',
    async (data, { rejectWithValue }) => {
        return { ...mockUser, role: 'admin', data: { ...mockUser.data, role: 'admin', name: 'Wise Sensei' } };
    }
);

export const saveUserProfile = createAsyncThunk(
    'user/saveProfile',
    async ({ name, photoFile, ...otherData }, { getState }) => {
        const currentProfile = getState().user.profile;
        const currentData = currentProfile.data || {};

        // Update both root and nested data to ensure compatibility across components
        // Some components read from root, others (like Dashboard) read from .data
        const updatedData = {
            ...currentData,
            name,
            ...otherData
        };

        return {
            ...currentProfile,
            name,
            ...otherData,
            data: updatedData
        };
    }
);

// Update User Activity - Mock Version (Frontend Only)
export const updateActivity = createAsyncThunk(
    'user/updateActivity',
    async ({ type, gameId, xpEarned, description }, { getState }) => {
        const currentXP = getState().user.profile.data.rewards.xp || 0;
        const currentCoins = getState().user.profile.data.rewards.coins || 0;

        // Simple mock calculation
        const newXP = currentXP + (xpEarned || 10);
        const newCoins = currentCoins + 5;
        const newRank = newXP > 5000 ? 'Ninja Master' : 'Apprentice';

        return {
            xp: newXP,
            coins: newCoins,
            rank: newRank,
            type,
            gameId,
            description
        };
    }
);

const initialState = {
    profile: mockUser, // Start LOGGED IN by default
    status: 'succeeded',
    error: null,
    privacy: {
        searchVisibility: true,
        shareDataPartners: false,
        saveChatHistory: true,
        retentionPeriod: '1_year'
    },
    account: {
        twoFactor: false,
        sessions: [
            { id: 1, device: 'Chrome on Windows', ip: '127.0.0.1', location: 'Localhost', active: true, lastActive: 'Now' }
        ]
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        },
        updatePrivacy: (state, action) => {
            state.privacy = { ...state.privacy, ...action.payload };
        },
        updateAccount: (state, action) => {
            state.account = { ...state.account, ...action.payload };
        },
        toggleTwoFactor: (state) => {
            state.account.twoFactor = !state.account.twoFactor;
        },
        terminateSession: (state, action) => {
            state.account.sessions = state.account.sessions.filter(session => session.id !== action.payload);
        },
        terminateAllOtherSessions: (state) => {
            state.account.sessions = state.account.sessions.filter(session => session.active);
        },
        setUser: (state, action) => {
            state.profile = action.payload;
            state.status = 'succeeded';
        },
        clearUser: (state) => {
            state.profile = null;
            state.status = 'idle';
        },
        setLoading: (state, action) => {
            state.status = action.payload ? 'loading' : 'idle';
        },
        addAchievement: (state, action) => {
            // Check if profile exists
            if (state.profile && state.profile.data) {
                // Initialize if undefined
                if (!state.profile.data.achievements) {
                    state.profile.data.achievements = [];
                }
                // Add the new achievement (action.payload.achievement)
                // In a real app we would check action.payload.userId matched state.profile.id
                // Here we just mock it by adding to current user for instant feedback
                state.profile.data.achievements.unshift(action.payload.achievement);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            // Signup
            .addCase(signupUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            // Admin
            .addCase(verifyAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.profile = null;
                state.status = 'idle';
            })
            // Save Profile
            .addCase(saveUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            // Update Activity
            .addCase(updateActivity.fulfilled, (state, action) => {
                if (state.profile && state.profile.data) {
                    state.profile.data.rewards.xp = action.payload.xp;
                    state.profile.data.rewards.coins = action.payload.coins;
                    state.profile.data.rewards.currentTitle = action.payload.rank;
                    state.profile.data.xp = action.payload.xp;
                    state.profile.data.rank = action.payload.rank;
                    // Add to activity log if desired
                    state.profile.data.activityLog = [
                        {
                            id: Date.now(),
                            type: action.payload.type,
                            description: action.payload.description,
                            date: new Date().toISOString()
                        },
                        ...(state.profile.data.activityLog || [])
                    ];
                }
            });
    }
});

export const {
    updateProfile,
    updatePrivacy,
    updateAccount,
    toggleTwoFactor,
    terminateSession,
    terminateAllOtherSessions,
    setUser,
    clearUser,
    setLoading,
    addAchievement
} = userSlice.actions;

export const selectUser = (state) => state.user.profile;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectUserPrivacy = (state) => state.user.privacy;
export const selectUserAccount = (state) => state.user.account;

export default userSlice.reducer;
