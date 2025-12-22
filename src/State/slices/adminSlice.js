import { createSlice } from '@reduxjs/toolkit';

// --- Mock Data Generators ---

const generateMockUsers = (count = 20) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `usr_${i + 100}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@eduverse.com`,
        role: i === 0 ? 'admin' : 'student',
        status: i % 10 === 0 ? 'banned' : (i % 5 === 0 ? 'suspended' : 'active'),
        joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
        lastActive: '2 hours ago',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i + 1}`,
        reports: Math.floor(Math.random() * 5),
        activityLog: [
            { id: 1, action: 'Login', time: '2 hours ago' },
            { id: 2, action: 'Completed Quiz', time: 'Yesterday' }
        ]
    }));
};

const mockTools = [
    { id: 't1', name: 'Scientific Calculator', status: 'active', usage: 1540, apiKey: 'sk_live_...' },
    { id: 't2', name: 'Graphing Plotter', status: 'active', usage: 890, apiKey: 'sk_live_...' },
    { id: 't3', name: 'AI Tutor', status: 'maintenance', usage: 3200, apiKey: 'sk_test_...' },
    { id: 't4', name: 'Unit Converter', status: 'disabled', usage: 0, apiKey: null },
];

const mockReports = [
    { id: 'r1', reportedUser: 'user_102', reporter: 'user_105', reason: 'Inappropriate language', context: 'Message in #general', status: 'pending' },
    { id: 'r2', reportedUser: 'user_115', reporter: 'user_101', reason: 'Spamming', context: 'Forum post', status: 'resolved' },
];

const initialState = {
    users: generateMockUsers(),
    tools: mockTools,
    reports: mockReports,
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // --- User Management ---
        banUser: (state, action) => {
            const user = state.users.find(u => u.id === action.payload);
            if (user) user.status = 'banned';
        },
        suspendUser: (state, action) => {
            const user = state.users.find(u => u.id === action.payload);
            if (user) user.status = 'suspended';
        },
        restoreUser: (state, action) => {
            const user = state.users.find(u => u.id === action.payload);
            if (user) user.status = 'active';
        },
        // --- Tools Management ---
        toggleToolStatus: (state, action) => {
            const tool = state.tools.find(t => t.id === action.payload);
            if (tool) {
                tool.status = tool.status === 'active' ? 'disabled' : 'active';
            }
        },
        updateToolKey: (state, action) => {
            const { id, key } = action.payload;
            const tool = state.tools.find(t => t.id === id);
            if (tool) tool.apiKey = key;
        },
        // --- Community Moderation ---
        resolveReport: (state, action) => {
            const report = state.reports.find(r => r.id === action.payload);
            if (report) report.status = 'resolved';
        },
        deleteReport: (state, action) => {
            state.reports = state.reports.filter(r => r.id !== action.payload);
        }
    }
});

export const {
    banUser, suspendUser, restoreUser,
    toggleToolStatus, updateToolKey,
    resolveReport, deleteReport
} = adminSlice.actions;

export const selectAllUsers = (state) => state.admin.users;
export const selectAllTools = (state) => state.admin.tools;
export const selectAllReports = (state) => state.admin.reports;

export default adminSlice.reducer;
