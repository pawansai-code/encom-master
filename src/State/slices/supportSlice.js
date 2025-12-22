import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore';
import app from '../../firebase';

const db = getFirestore(app);

// Async Thunks
export const createTicket = createAsyncThunk(
    'support/createTicket',
    async (ticketData, { rejectWithValue }) => {
        try {
            const docRef = await addDoc(collection(db, 'support_tickets'), {
                ...ticketData,
                status: 'open',
                date: new Date().toISOString()
            });
            return { id: docRef.id, ...ticketData, status: 'open', date: new Date().toISOString() };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTickets = createAsyncThunk(
    'support/fetchTickets',
    async (_, { rejectWithValue }) => {
        try {
            const ticketsRef = collection(db, 'support_tickets');
            const q = query(ticketsRef, orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const tickets = [];
            querySnapshot.forEach((doc) => {
                tickets.push({ id: doc.id, ...doc.data() });
            });
            return tickets;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'support/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const ticketRef = doc(db, 'support_tickets', id);
            await updateDoc(ticketRef, { status });
            return { id, status };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    tickets: [],
    status: 'idle',
    error: null,
};

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createTicket.fulfilled, (state, action) => {
                // Determine if we should add it to list (if user can view their own tickets? For now just success)
            })
            // Fetch
            .addCase(fetchTickets.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tickets = action.payload;
            })
            // Update
            .addCase(updateTicketStatus.fulfilled, (state, action) => {
                const ticket = state.tickets.find(t => t.id === action.payload.id);
                if (ticket) ticket.status = action.payload.status;
            });
    }
});

export const selectTickets = (state) => state.support.tickets;

export default supportSlice.reducer;
