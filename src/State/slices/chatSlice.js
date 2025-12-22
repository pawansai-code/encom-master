import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { child, ref as databaseRef, get, push, remove, update } from 'firebase/database';
import { auth, database } from '../../firebase';

const API_URL = 'http://localhost:8000/api/chat'; // Adjust based on actual backend port

const initialState = {
    currentConversationId: null,
    currentConversation: [], // Array of { id, text, sender, timestamp }
    history: [], // Array of { id, title, date, snippet }
    settings: {
        notifications: true,
        theme: 'light',
        fontSize: 'medium', // small, medium, large
        clearHistoryOnExit: false,
    },
    loading: false,
    error: null,
};

// Async Thunks

// Send Message to Bot (and backend)
export const sendMessageToBot = createAsyncThunk(
    'chat/sendMessage',
    async ({ message, conversationId }, { rejectWithValue, getState }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            // 1. Optimistic update is handled by the component or a separate action, 
            // but here we just focus on the API call and response.

            // 2. Call Backend for Bot Response
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message }),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to get response from chatbot';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                    if (errorData.details) errorMessage += `: ${errorData.details} `;
                } catch (e) {
                    // response was not json
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const botReply = data.answer;

            // 3. Save to Firebase (User Message + Bot Reply)
            const timestamp = Date.now();
            const userMsgObj = { sender: 'user', text: message, timestamp };
            const botMsgObj = { sender: 'bot', text: botReply, timestamp: Date.now() };

            let chatId = conversationId;
            let isNewChat = false;

            // If no ID provided, create a new one
            if (!chatId) {
                isNewChat = true;
                chatId = `chat_${timestamp} `;
            }

            const chatRef = databaseRef(database, `users / ${user.uid} /chat/history / ${chatId}/messages`);

            await push(chatRef, userMsgObj);
            await push(chatRef, botMsgObj);

            // If new chat, also save metadata
            if (isNewChat) {
                const metaRef = databaseRef(database, `users/${user.uid}/chat/history/${chatId}`);
                await update(metaRef, {
                    title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
                    date: timestamp,
                    lastMessage: botReply
                });
            } else {
                // Update last activity/message
                const metaRef = databaseRef(database, `users/${user.uid}/chat/history/${chatId}`);
                await update(metaRef, {
                    lastMessage: botReply,
                    date: timestamp
                });
            }

            return { botMsg: botMsgObj, chatId: isNewChat ? chatId : null }; // Return new ID if created

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch Chat History
export const fetchChatHistory = createAsyncThunk(
    'chat/fetchHistory',
    async (_, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const dbRef = databaseRef(database);
            const snapshot = await get(child(dbRef, `users/${user.uid}/chat/history`));

            if (snapshot.exists()) {
                const data = snapshot.val();
                // Transform object to array
                const historyList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key] // Should contain title, lastMessage, date, etc.
                }));
                return historyList;
            }
            return [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Save/Update Settings
export const updateChatSettings = createAsyncThunk(
    'chat/updateSettings',
    async (newSettings, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            await update(databaseRef(database, `users/${user.uid}/chat/settings`), newSettings);
            return newSettings;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch Settings
export const fetchChatSettings = createAsyncThunk(
    'chat/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const dbRef = databaseRef(database);
            const snapshot = await get(child(dbRef, `users/${user.uid}/chat/settings`));

            if (snapshot.exists()) {
                return snapshot.val();
            }
            return initialState.settings; // Default
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete All Chat History
export const deleteChatHistory = createAsyncThunk(
    'chat/deleteHistory',
    async (_, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            // Delete all chats
            await remove(databaseRef(database, `users/${user.uid}/chat/history`));
            await remove(databaseRef(database, `users/${user.uid}/chat/current_session`));

            return;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.currentConversation.push(action.payload);
        },
        startNewChat: (state) => {
            state.currentConversation = [];
            state.currentConversationId = null;
            state.error = null;
        },
        setConversation: (state, action) => {
            state.currentConversation = action.payload.messages ? Object.values(action.payload.messages) : [];
            state.currentConversationId = action.payload.id;
        }
    },
    extraReducers: (builder) => {
        builder
            // Send Message
            .addCase(sendMessageToBot.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessageToBot.fulfilled, (state, action) => {
                state.loading = false;
                state.currentConversation.push(action.payload.botMsg);
                // If new chat ID returned, update state
                if (action.payload.chatId) {
                    state.currentConversationId = action.payload.chatId;
                }
            })
            .addCase(sendMessageToBot.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch History
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.history = action.payload;
            })
            // Settings
            .addCase(fetchChatSettings.fulfilled, (state, action) => {
                state.settings = { ...state.settings, ...action.payload };
            })
            .addCase(updateChatSettings.fulfilled, (state, action) => {
                state.settings = { ...state.settings, ...action.payload };
            })
            .addCase(deleteChatHistory.fulfilled, (state) => {
                state.history = [];
                state.currentConversation = [];
                state.currentConversationId = null;
            });
    }
});

export const { addMessage, startNewChat, setConversation } = chatSlice.actions;

export const selectCurrentChatId = (state) => state.chat.currentConversationId;

export const selectChatMessages = (state) => state.chat.currentConversation;
export const selectChatHistory = (state) => state.chat.history;
export const selectChatSettingsState = (state) => state.chat.settings;
export const selectChatLoading = (state) => state.chat.loading;
export const selectChatError = (state) => state.chat.error;

export default chatSlice.reducer;
