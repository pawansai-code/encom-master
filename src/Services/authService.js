
import {
    createUserWithEmailAndPassword,
    deleteUser,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const formatError = (error) => {
    // Strip "Firebase: " prefix if present 
    let message = error.message.replace("Firebase: ", "");

    // Clean up common error codes
    if (message.includes("auth/email-already-in-use")) return "This email is already registered.";
    if (message.includes("auth/user-not-found") || message.includes("auth/wrong-password") || message.includes("auth/invalid-credential")) return "Invalid email or password.";
    if (message.includes("auth/invalid-email")) return "Please enter a valid email address.";
    if (message.includes("auth/weak-password")) return "Password should be at least 6 characters.";
    if (message.includes("auth/popup-closed-by-user")) return "Sign in was cancelled.";
    if (message.includes("auth/too-many-requests")) return "Too many attempts. Please try again later.";

    // Remove assertions like (auth/...) for cleaner display
    return message.replace(/\(auth\/.*\)\.?/, "").trim();
};

export const authService = {
    // Sign up with email and password
    signUp: async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with name if provided
            if (name) {
                await updateProfile(user, {
                    displayName: name
                });
            }

            return { user, error: null };
        } catch (error) {
            return { user: null, error: formatError(error) };
        }
    },

    // Sign in with email and password
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { user: userCredential.user, error: null };
        } catch (error) {
            return { user: null, error: formatError(error) };
        }
    },

    // Sign in with Google
    googleLogin: async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return { user: result.user, error: null };
        } catch (error) {
            return { user: null, error: formatError(error) };
        }
    },

    // Logout
    logout: async () => {
        try {
            await signOut(auth);
            return { error: null };
        } catch (error) {
            return { error: formatError(error) };
        }
    },

    // Send Verification Email
    verifyEmail: async (user) => {
        try {
            await sendEmailVerification(user);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: formatError(error) };
        }
    },

    // Send Password Reset Email
    sendPasswordReset: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: formatError(error) };
        }
    },

    // Delete Account
    deleteAccount: async (user) => {
        try {
            await deleteUser(user);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: formatError(error) };
        }
    }
};
