import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import ChatbotFloatingIcon from './Components/Common/ChatbotFloatingIcon';
import NinjaLoader from './Components/Common/NinjaLoader';
import { setLoading } from './State/slices/userSlice';


import AboutPage from './Pages/About/AboutPage';
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
            
            {/* Tools & Funzone */}
            <Route path="/tools" element={<ToolsHub />} />
            <Route path="/tools/:toolId" element={<ToolView />} />
            <Route path="/funzone" element={<FunzoneHub />} />
            <Route path="/funzone/:gameId" element={<GameView />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/journal" element={<JournalHub />} />

            <Route path="/hub/contact" element={<ContactUs />} />
            <Route path="/HomePage" element={<Homepage />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ChatbotFloatingIcon />
    </>
  );
}

export default App;
