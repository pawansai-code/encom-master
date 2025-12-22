import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
// Async Thunks
import { child, ref as databaseRef, get, set, update } from 'firebase/database';
import app, { auth, database, storage } from '../../firebase'; // app is default export, auth/storage/database are named exports

const defaultUserState = {
    streaks: {
        login: { current: 0, longest: 0, lastActive: null, history: {} },
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
        coins: 0,
        points: 0,
        level: 1,
        xp: 0,
        unlockedTitles: ['Novice'],
        currentTitle: 'Novice',
        badges: [],
        medals: []
    },
    wallet: {
        balance: 0,
        transactions: []
    },
    activityLog: [],
    role: 'student',
    settings: {
        theme: 'light',
        notifications: true
    }
};

export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user data from Realtime Database
            const dbRef = databaseRef(database);
            const snapshot = await get(child(dbRef, `users/${user.uid}`));
            let userData = defaultUserState;

            if (snapshot.exists()) {
                userData = snapshot.val();

                // CHECK BAN STATUS
                if (userData.status === 'banned') {
                    await signOut(auth);
                    return rejectWithValue("Your account has been suspended. Contact support.");
                }
            } else {
                // If no data exists (e.g. old user), create it
                await set(databaseRef(database, 'users/' + user.uid), {
                    ...defaultUserState,
                    email: user.email,
                    username: user.displayName
                });
            }

            return {
                uid: user.uid,
                email: user.email,
                name: user.displayName || 'Ninja Student',
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                data: userData
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signupUser = createAsyncThunk(
    'user/signup',
    async ({ email, password, username }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with username
            await updateFirebaseProfile(user, {
                displayName: username,
                photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username
            });

            // Create User Data in Realtime Database
            const newUserData = {
                ...defaultUserState,
                email: user.email,
                username: username,
                createdAt: new Date().toISOString()
            };

            await set(databaseRef(database, 'users/' + user.uid), newUserData);

            return {
                uid: user.uid,
                email: user.email,
                name: username,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                data: newUserData // Return data to state
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signupAdmin = createAsyncThunk(
    'user/signupAdmin',
    async ({ email, password, username, adminKey }, { rejectWithValue }) => {
        try {
            // 1. Create User in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Verify Key
            const db = getFirestore(app);
            const secretsRef = doc(db, "config", "admin_secrets");
            let validKey = 'SENSEI';
            try {
                const secretsSnap = await getDoc(secretsRef);
                if (secretsSnap.exists()) {
                    validKey = secretsSnap.data().key;
                }
            } catch (err) {
                console.warn("Firestore access failed. Using default key.", err);
            }

            if (adminKey !== validKey) {
                // Invalid key: Cleanup
                await user.delete(); // Try to delete the just-created user
                return rejectWithValue("Invalid Sensei Key. Initiation Failed.");
            }

            // 3. Update profile
            await updateFirebaseProfile(user, {
                displayName: username,
                photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username
            });

            // 4. Create Admin Data in Realtime Database -- Fail Safe
            const newUserData = {
                ...defaultUserState,
                email: user.email,
                username: username,
                role: 'admin',
                createdAt: new Date().toISOString()
            };

            try {
                await set(databaseRef(database, 'users/' + user.uid), newUserData);
            } catch (dbErr) {
                console.error("Admin Signup: DB Write Failed (proceeding anyway)", dbErr);
                // We proceed because Auth + Key matched. User is created.
            }

            return {
                uid: user.uid,
                email: user.email,
                name: username,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                data: newUserData
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Verify Admin Key
export const verifyAdmin = createAsyncThunk(
    'user/verifyAdmin',
    async ({ email, password, adminKey }, { rejectWithValue }) => {
        try {
            // 1. Authenticate with Firebase Auth first
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. QUICK CHECK: If user is already an admin in DB, skip key check
            const userCheckRef = databaseRef(database);
            const userSnapshot = await get(child(userCheckRef, `users/${user.uid}`));

            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                if (userData.role === 'admin') {
                    // Already an admin, let them in quickly!
                    return {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName || 'Wise Sensei',
                        role: 'admin',
                        data: userData
                    };
                }
            }

            // 3. If not verified as admin in DB, Check Admin Key against Firestore 'config/admin_secrets'
            const db = getFirestore(app); // Lazy init

            const secretsRef = doc(db, "config", "admin_secrets");
            let validKey = 'SENSEI';
            try {
                const secretsSnap = await getDoc(secretsRef);
                if (secretsSnap.exists()) {
                    validKey = secretsSnap.data().key;
                }
            } catch (err) {
                console.warn("Firestore access failed (likely rules/setup). Using default key.", err);
            }

            if (adminKey !== validKey) {
                await signOut(auth); // invalid key, mitigate risk
                return rejectWithValue("Invalid Sensei Key. Access Denied.");
            }

            // Fetch user data from Realtime Database - Fail Safe
            const finalDbRef = databaseRef(database);
            let userData = defaultUserState;

            try {
                const snapshot = await get(child(finalDbRef, `users/${user.uid}`));
                if (snapshot.exists()) {
                    userData = snapshot.val();
                } else {
                    // Create minimal admin data if missing
                    const newAdminData = {
                        ...defaultUserState,
                        role: 'admin',
                        email: user.email,
                        username: user.displayName || 'Wise Sensei'
                    };
                    await set(databaseRef(database, 'users/' + user.uid), newAdminData);
                    userData = newAdminData;
                }
            } catch (dbErr) {
                console.error("VerifyAdmin: DB Read/Write Failed (proceeding with temporary admin session)", dbErr);
                // Fallback: Construct minimal admin data
                userData = {
                    ...defaultUserState,
                    role: 'admin',
                    username: user.displayName || 'Wise Sensei'
                };
            }

            return {
                uid: user.uid,
                email: user.email,
                name: user.displayName || 'Wise Sensei',
                role: 'admin', // Force admin role since Key passed
                data: userData
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveUserProfile = createAsyncThunk(
    'user/saveProfile',
    async ({ name, photoFile, ...otherData }, { rejectWithValue, getState }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');

            let newPhotoURL = user.photoURL;

            // 1. Upload new photo if provided
            if (photoFile) {
                const sRef = storageRef(storage, `profile_images/${user.uid}_${Date.now()}`);
                const snapshot = await uploadBytes(sRef, photoFile);
                newPhotoURL = await getDownloadURL(snapshot.ref);
            }

            // 2. Update Firebase Auth Profile
            await updateFirebaseProfile(user, {
                displayName: name,
                photoURL: newPhotoURL
            });

            // 3. Update Realtime Database
            const updates = {};
            if (name) updates['/users/' + user.uid + '/username'] = name;
            if (otherData) {
                // Map other data to DB fields if needed, or store in 'profile' node
                // For now assuming shallow updates or specific logic
            }
            await update(databaseRef(database), updates);


            // 4. Return updated profile data
            // Merge with existing state to keep other fields if any
            return {
                ...getState().user.profile,
                name,
                photoURL: newPhotoURL,
                ...otherData
            };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    profile: null, // User is null when not logged in
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
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
            { id: 1, device: 'Chrome on Windows', ip: '192.168.1.1', location: 'New York, USA', active: true, lastActive: 'Now' }
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
            // For manually setting user from auth state listener if needed
            state.profile = action.payload;
            state.status = 'succeeded';
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Signup
            .addCase(signupUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Admin Signup
            .addCase(signupAdmin.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signupAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(signupAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.profile = null;
                state.status = 'idle';
            })
            // Admin Login
            .addCase(verifyAdmin.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(verifyAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(verifyAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Save Profile
            .addCase(saveUserProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(saveUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(saveUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
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
    setUser
} = userSlice.actions;

export const selectUser = (state) => state.user.profile;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectUserPrivacy = (state) => state.user.privacy;
export const selectUserAccount = (state) => state.user.account;

export default userSlice.reducer;
