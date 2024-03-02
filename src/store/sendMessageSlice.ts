// src/store/sendMessageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SendMessageState {
    messageToSend: string;
}

const initialState: SendMessageState = {
    messageToSend: '',
};

export const sendMessageSlice = createSlice({
    name: 'sendMessage',
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<string>) => {
            state.messageToSend = action.payload;
        },
        // Define other actions as needed
    },
});

export const { setMessage } = sendMessageSlice.actions;

export default sendMessageSlice.reducer;
