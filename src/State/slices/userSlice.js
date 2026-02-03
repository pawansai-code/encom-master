import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../../firebase';
import { authService } from '../../Services/authService';

export const defaultUserState = {
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
// Async Thunks
const ADMIN_EMAIL = "eduverseofficial17@gmail.com";

export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        const { user, error } = await authService.login(email, password);
        if (error) return rejectWithValue(error);

        const role = user.email === ADMIN_EMAIL ? 'admin' : 'student';

        // Merge firebase user with default app state structure
        return {
            uid: user.uid,
            email: user.email,
            role: role,
            data: {
                ...defaultUserState,
                name: user.displayName || (role === 'admin' ? 'Admin' : 'Student'),
                email: user.email,
                role: role
            }
        };
    }
);

export const googleLoginUser = createAsyncThunk(
    'user/googleLogin',
    async (_, { rejectWithValue }) => {
        const { user, error } = await authService.googleLogin();
        if (error) return rejectWithValue(error);

        const role = user.email === ADMIN_EMAIL ? 'admin' : 'student';

        return {
            uid: user.uid,
            email: user.email,
            role: role,
            data: {
                ...defaultUserState,
                name: user.displayName || (role === 'admin' ? 'Admin' : 'Student'),
                email: user.email,
                role: role,
                avatar: user.photoURL
            }
        };
    }
);

export const signupUser = createAsyncThunk(
    'user/signup',
    async ({ email, password, name }, { rejectWithValue }) => {
        const { user, error } = await authService.signUp(email, password, name);
        if (error) return rejectWithValue(error);

        const role = user.email === ADMIN_EMAIL ? 'admin' : 'student';

        return {
            uid: user.uid,
            email: user.email,
            role: role,
            data: {
                ...defaultUserState,
                name: user.displayName || name || (role === 'admin' ? 'Admin' : 'Student'),
                email: user.email,
                role: role
            }
        };
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        const { error } = await authService.logout();
        if (error) return rejectWithValue(error);
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
    async ({ name, photoFile, ...otherData }, { getState, rejectWithValue }) => {
        try {
            const currentProfile = getState().user.profile;
            const currentData = currentProfile.data || {};
            let photoURL = currentProfile.photoURL || currentProfile.avatar;

            // 1. Upload Photo if provided
            if (photoFile) {
                // Ensure user is logged in
                if (!auth.currentUser) throw new Error("No user logged in");

                const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile_${Date.now()}`);
                const snapshot = await uploadBytes(storageRef, photoFile);
                photoURL = await getDownloadURL(snapshot.ref);

                // Update Firebase Auth Profile
                await updateAuthProfile(auth.currentUser, {
                    photoURL: photoURL,
                    displayName: name || auth.currentUser.displayName
                });
            } else if (name && name !== auth.currentUser?.displayName) {
                // Just update name if no photo but name changed
                if (auth.currentUser) {
                    await updateAuthProfile(auth.currentUser, {
                        displayName: name
                    });
                }
            }

            // Update both root and nested data to ensure compatibility across components
            // Some components read from root, others (like Dashboard) read from .data
            const updatedData = {
                ...currentData,
                name,
                avatar: photoURL,
                ...otherData
            };

            return {
                ...currentProfile,
                name,
                photoURL: photoURL, // Standardize on photoURL
                avatar: photoURL,   // Keep legacy avatar field for compatibility
                ...otherData,
                data: updatedData
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Verify Email
export const verifyUserEmail = createAsyncThunk(
    'user/verifyEmail',
    async (_, { rejectWithValue }) => {
        if (!auth.currentUser) return rejectWithValue("No user logged in.");
        const { error } = await authService.verifyEmail(auth.currentUser);
        if (error) return rejectWithValue(error);
        return { success: true };
    }
);

// Reset Password
export const resetUserPassword = createAsyncThunk(
    'user/resetPassword',
    async (email, { rejectWithValue }) => {
        const { error } = await authService.sendPasswordReset(email);
        if (error) return rejectWithValue(error);
        return { success: true };
    }
);

// Delete Account
export const deleteUserAccount = createAsyncThunk(
    'user/deleteAccount',
    async (_, { rejectWithValue }) => {
        if (!auth.currentUser) return rejectWithValue("No user logged in.");
        const { error } = await authService.deleteAccount(auth.currentUser);
        if (error) return rejectWithValue(error);
        return null; // Return null on success
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
    profile: null, // Start LOGGED OUT by default to allow real Auth to take over
    status: 'loading', // Start loading until Auth Check completes
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
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Google Login
            .addCase(googleLoginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(googleLoginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Signup
            .addCase(signupUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
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
            })
            // Delete Account
            .addCase(deleteUserAccount.fulfilled, (state) => {
                state.profile = null;
                state.status = 'idle';
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
