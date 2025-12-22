import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import announcementReducer from './slices/announcementSlice';
import appReducer from './slices/appSlice';
import chatReducer from './slices/chatSlice';
import gameReducer from './slices/gameSlice';
import journalReducer from './slices/journalSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import rewardsReducer from './slices/rewardsSlice';
import streakReducer from './slices/streakSlice';
import supportReducer from './slices/supportSlice';
import toolReducer from './slices/toolSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        admin: adminReducer,
        tools: toolReducer,
        games: gameReducer,
        journal: journalReducer,
        streaks: streakReducer,
        rewards: rewardsReducer,
        leaderboards: leaderboardReducer,
        announcements: announcementReducer,
        support: supportReducer,
        chat: chatReducer,
    },
});

export default store;
