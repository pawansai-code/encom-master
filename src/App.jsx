import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import ChatbotFloatingIcon from './Components/Common/ChatbotFloatingIcon';
import NinjaLoader from './Components/Common/NinjaLoader';
import { setLoading, setUser } from './State/slices/userSlice';



import AboutPage from './Pages/About/AboutPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminLoginPage from './Pages/Auth/AdminLoginPage';
import AdminSignupPage from './Pages/Auth/AdminSignupPage';
import ForgotPasswordPage from './Pages/Auth/ForgotPasswordPage';
import LoginPage from './Pages/Auth/LoginPage';
import ResetPasswordPage from './Pages/Auth/ResetPasswordPage';
import SignupPage from './Pages/Auth/SignupPage';
import VerifyEmailPage from './Pages/Auth/VerifyEmailPage';
import ContactUs from './Pages/ContactUs/ContactUs';
import DashboardPage from './Pages/Dashboard/DashboardPage';
import FunzoneHub from './Pages/Funzone/FunzoneHub';
import GameView from './Pages/Funzone/GameView';
import Homepage from './Pages/Homepage/Homepage';
import JournalHub from './Pages/Journal/JournalHub';
import SettingsPage from './Pages/Settings/SettingsPage';
import StreaksPage from './Pages/Streaks/StreaksPage';
// Additional Features
import ToolsHub from './Pages/Tools/ToolsHub';
import ToolView from './Pages/Tools/ToolView';

// Features
import ChatbotPage from './Pages/Chatbot/ChatbotPage';
import LeaderboardsHub from './Pages/Leaderboards/LeaderboardsHub';
import RewardsPage from './Pages/Rewards/RewardsPage';


function App() {
  const dispatch = useDispatch();
  const { profile: user, status } = useSelector((state) => state.user);
  const loading = status === 'loading';

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            // Check expiry
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
            } else {
                // Restore user state
                dispatch(setUser({
                    uid: decoded.id,
                    email: decoded.email || '', // Depending on what's in token
                    role: decoded.role,
                    data: {
                      role: decoded.role,
                      name: decoded.name || 'Ninja Student', // Decode name if in token, else fallback
                      email: decoded.email
                    }
                }));
            }
        } catch (error) {
            console.error("Invalid token", error);
            localStorage.removeItem('token');
        }
    }
    dispatch(setLoading(false));
  }, [dispatch]);


  if (loading) {
     return <NinjaLoader />;
  }


  return (
    <>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Protected User Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Tools & Funzone */}
            <Route path="/tools" element={<ToolsHub />} />
            <Route path="/tools/:toolId" element={<ToolView />} />
            <Route path="/funzone" element={<FunzoneHub />} />
            <Route path="/funzone/:gameId" element={<GameView />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/journal" element={<JournalHub />} />
            <Route path="/streaks" element={<StreaksPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/leaderboards" element={<LeaderboardsHub />} />
            <Route path="/hub/contact" element={<ContactUs />} />
            <Route path="/HomePage" element={<Homepage />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/signup" element={<AdminSignupPage />} />
            <Route path="/admin/dashboard" element={user && user.data?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ChatbotFloatingIcon />
    </>
  );
}

export default App;
