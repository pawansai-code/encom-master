import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import NinjaLoader from './Components/Common/NinjaLoader';
import { auth } from './firebase';
import { clearUser, defaultUserState, setLoading, setUser } from './State/slices/userSlice';


import AboutPage from './Pages/About/AboutPage';
import AchievementsPage from './Pages/Achievements/AchievementsPage';
import ContactUs from './Pages/ContactUs/ContactUs';
import DashboardPage from './Pages/Dashboard/DashboardPage';
import FunzoneHub from './Pages/Funzone/FunzoneHub';
import GameView from './Pages/Funzone/GameView';
import Homepage from './Pages/Homepage/Homepage';
import JournalHub from './Pages/Journal/JournalHub';
import SettingsPage from './Pages/Settings/SettingsPage';

// Additional Features
import ToolsHub from './Pages/Tools/ToolsHub';
import ToolView from './Pages/Tools/ToolView';

// Features
import ChatbotPage from './Pages/Chatbot/ChatbotPage';
import NotFoundPage from './Pages/NotFound/NotFoundPage';

// Auth
import AdminForgotPassword from './Pages/Auth/AdminForgotPassword';
import AdminLogin from './Pages/Auth/AdminLogin';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import UserLogin from './Pages/Auth/UserLogin';
import UserSignup from './Pages/Auth/UserSignup';
import VerifyEmail from './Pages/Auth/VerifyEmail';

import AdminDashboard from './Pages/Admin/AdminDashboard';



function App() {
  const dispatch = useDispatch();
  const { profile: user, status } = useSelector((state) => state.user);
  const loading = status === 'loading';

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            // User is signed in, restore Redux state
            // We reconstruct the user object to match what userSlice expects
            const role = currentUser.email === 'eduverseofficial17@gmail.com' ? 'admin' : 'student';
            
            // Merge with default state to ensure game data exists
            const restoredUser = {
                uid: currentUser.uid,
                email: currentUser.email,
                role: role,
                data: {
                    ...defaultUserState, // Defaults first
                    // Override with Auth data
                    name: currentUser.displayName || (role === 'admin' ? 'Admin' : 'Student'),
                    email: currentUser.email,
                    avatar: currentUser.photoURL,
                    role: role,
                    // If we had a database, we would fetch and merge here.
                    // For now, preservation of complex state across reloads requires a DB.
                    // This "reset to default" on reload is a known limitation without a DB.
                    // But at least it won't crash.
                }
            };
            dispatch(setUser(restoredUser));
        } else {
            // User is signed out
            dispatch(clearUser());
        }
        dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);


  if (loading) {
     return <NinjaLoader />;
  }


  return (
    <>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Dashboard and Authenticated Features */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            
            {/* Tools & Funzone */}
            <Route path="/tools" element={<ToolsHub />} />
            <Route path="/tools/:toolId" element={<ToolView />} />
            <Route path="/funzone" element={<FunzoneHub />} />
            <Route path="/funzone/:gameId" element={<GameView />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/journal" element={<JournalHub />} />

            <Route path="/hub/contact" element={<ContactUs />} />
            <Route path="/HomePage" element={<Homepage />} />
            
            {/* Authentication */}
            <Route path="/auth/login" element={<UserLogin />} />
            <Route path="/auth/signup" element={<UserSignup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/admin/login" element={<AdminLogin />} />
            <Route path="/auth/admin/forgot-password" element={<AdminForgotPassword />} />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>

    </>
  );
}

export default App;
