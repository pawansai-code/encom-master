import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async Thunks
export const createTicket = createAsyncThunk(
    'support/createTicket',
    async (ticketData, { rejectWithValue }) => {
        try {
            // Mock Create Ticket
            return { id: 'mock-ticket-' + Date.now(), ...ticketData, status: 'open', date: new Date().toISOString() };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTickets = createAsyncThunk(
    'support/fetchTickets',
    async (_, { rejectWithValue }) => {
        try {
            // Mock Fetch Tickets
            return [
                { id: 'mock-ticket-1', subject: 'Login Issue', message: 'Cannot login', status: 'open', date: new Date().toISOString() },
                { id: 'mock-ticket-2', subject: 'Feature Request', message: 'Add dark mode', status: 'closed', date: new Date().toISOString() }
            ];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'support/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            // Mock Update Status
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
                state.tickets.unshift(action.payload);
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
