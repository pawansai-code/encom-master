import { Route, Routes } from 'react-router-dom';
import './App.css';
import FloatingChatbotIcon from './Components/Common/FloatingChatbotIcon.jsx';
import GlobalNinjaGuide from './Components/Common/GlobalNinjaGuide';
import AboutPage from './Pages/About/AboutPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminLoginPage from './Pages/Auth/AdminLoginPage';
import AdminSignupPage from './Pages/Auth/AdminSignupPage';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage';
import LoginPage from './Pages/Auth/LoginPage';
import ResetPasswordPage from './Pages/Auth/ResetPasswordPage';
import SignupPage from './Pages/Auth/SignupPage';
import VerifyEmailPage from './Pages/Auth/VerifyEmailPage';
import ChatbotPage from './Pages/Chatbot/ChatbotPage.jsx';
import ContactUs from './Pages/ContactUs/ContactUs';
import DashboardPage from './Pages/Dashboard/DashboardPage';
import FunzoneHub from './Pages/Funzone/FunzoneHub';
import GameView from './Pages/Funzone/GameView';
import HomePage from './Pages/Homepage/Homepage';
import JournalEntry from './Pages/Journal/JournalEntry';
import JournalHub from './Pages/Journal/JournalHub';
import LeaderboardsHub from './Pages/Leaderboards/LeaderboardsHub';
import ProfilePage from './Pages/Profile/ProfilePage';
import RewardsPage from './Pages/Rewards/RewardsPage';
import SettingsPage from './Pages/Settings/SettingsPage';
import StreaksPage from './Pages/Streaks/StreaksPage';
import ToolsHub from './Pages/Tools/ToolsHub';
import ToolView from './Pages/Tools/ToolView';

import { onAuthStateChanged } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth, database } from './firebase';
import { setUser } from './State/slices/userSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch extra data from Realtime Database
        try {
          // Use direct ref path to avoid 'pieceNum_' internal errors
          const userRef = ref(database, `users/${user.uid}`); 
          const snapshot = await get(userRef);
          
          let userData = null;
          if (snapshot.exists()) {
            userData = snapshot.val();
          }
          
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'Ninja Student',
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            data: userData
          }));
        } catch (error) {
          console.warn("App: DB Fetch failed (Permission/Network). Proceeding with Auth-Only user.", error.code || error);
          
          // CRITICAL FIX: Still log the user in, just without extra DB data
           dispatch(setUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'Ninja Student',
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            data: { role: 'student', username: 'Ninja Student' } // default role so app doesn't crash
          }));
        }
      } else {
        // User is signed out
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/admin" element={<AdminLoginPage />} />
        <Route path="/auth/admin/signup" element={<AdminSignupPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/tools" element={<ToolsHub />} />
        <Route path="/tools/:toolId" element={<ToolView />} />
        <Route path="/funzone" element={<FunzoneHub />} />
        <Route path="/funzone/:gameId" element={<GameView />} />
        <Route path="/journal" element={<JournalHub />} />
        <Route path="/journal/:entryId" element={<JournalEntry />} />
        <Route path="/streaks" element={<StreaksPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/leaderboards" element={<LeaderboardsHub />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
      <GlobalNinjaGuide />
      <FloatingChatbotIcon />
    </>
  )
}

export default App;
