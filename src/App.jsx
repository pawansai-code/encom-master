import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import ChatbotFloatingIcon from './Components/Common/ChatbotFloatingIcon';
import NinjaLoader from './Components/Common/NinjaLoader';
import { setLoading } from './State/slices/userSlice';


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


function App() {
  const dispatch = useDispatch();
  const { profile: user, status } = useSelector((state) => state.user);
  const loading = status === 'loading';

  useEffect(() => {
    // Simulate initial loading if needed, or just set loading to false immediately
     dispatch(setLoading(false));
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
        <ChatbotFloatingIcon />
    </>
  );
}

export default App;
