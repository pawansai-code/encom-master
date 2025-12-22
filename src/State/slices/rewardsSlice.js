import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    xp: 2500,
    level: 15,
    nextLevelXp: 3000,
    coins: 1250,
    points: 8500,
    titles: [
        { id: 1, name: 'Novice Ninja', unlocked: true, active: false },
        { id: 2, name: 'Code Warrior', unlocked: true, active: true },
        { id: 3, name: 'Algorithm Master', unlocked: false, active: false },
        { id: 4, name: 'Bug Hunter', unlocked: false, active: false },
    ],
    badges: [
        { id: 1, name: 'First Login', description: 'Logged in for the first time', type: 'boys', icon: '🥷', unlocked: true },
        { id: 2, name: 'Homework Hero', description: 'Completed 5 assignments', type: 'boys', icon: '⚔️', unlocked: true },
        { id: 3, name: 'Quiz Master', description: 'Scored 100% on a quiz', type: 'boys', icon: '🐲', unlocked: false },
        { id: 4, name: 'Social Butterfly', description: 'Made 3 friends', type: 'girls', icon: '🦋', unlocked: true },
        { id: 5, name: 'Helper', description: 'Helped a peer', type: 'girls', icon: '💖', unlocked: true },
        { id: 6, name: 'Star Student', description: 'Top of the class', type: 'girls', icon: '🌟', unlocked: false },
    ],
    medals: [
        { id: 1, name: 'Gold Medal', count: 1, icon: '🥇' },
        { id: 2, name: 'Silver Medal', count: 3, icon: '🥈' },
        { id: 3, name: 'Bronze Medal', count: 5, icon: '🥉' },
    ],
    history: [
        { id: 1, type: 'xp', amount: 100, reason: 'Completed Daily Challenge', date: '2025-12-12' },
        { id: 2, type: 'coin', amount: 50, reason: 'Logged in', date: '2025-12-12' },
    ]
};

const rewardsSlice = createSlice({
    name: 'rewards',
    initialState,
    reducers: {
        addXp: (state, action) => {
            state.xp += action.payload;
            if (state.xp >= state.nextLevelXp) {
                state.level += 1;
                state.nextLevelXp = Math.floor(state.nextLevelXp * 1.5);
            }
        },
        addCoins: (state, action) => {
            state.coins += action.payload;
        },
        unlockBadge: (state, action) => {
            const badge = state.badges.find(b => b.id === action.payload);
            if (badge) badge.unlocked = true;
        },
        setActiveTitle: (state, action) => {
            state.titles.forEach(t => t.active = false);
            const title = state.titles.find(t => t.id === action.payload);
            if (title && title.unlocked) title.active = true;
        }
    }
});

export const { addXp, addCoins, unlockBadge, setActiveTitle } = rewardsSlice.actions;

export const selectRewards = (state) => state.rewards;

export default rewardsSlice.reducer;
