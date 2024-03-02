import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    RecognitionResponse,
} from '../protos/speechrecognition_pb';

export interface Message {
    text: string,
    type: string,
    timestamp: number,
}

interface SubtitleContainer {
    sessionId: string;
    messages: Message[];
    recognizing: string;
    recognizingTranslation: string;
}

const initialState: SubtitleContainer = {
    sessionId: "",
    messages: [],
    recognizing: "",
    recognizingTranslation: ""
};

export const subtitleContainerSlide = createSlice({
    name: 'subtitleContainer',
    initialState,
    reducers: {
        setSessionId: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload;
        },
        addMessage: (state, action: PayloadAction<{text: string, type: string, timestamp: number}>) => {
            // Insertion sort: insert the new item in the correct position to keep the array sorted
            const { text, type, timestamp } = action.payload;
            const newItem: Message = { text, type, timestamp };
            let i = state.messages.length - 1;
            while (i >= 0 && state.messages[i].timestamp > newItem.timestamp) {
                i--;
            }
            if (state.messages.length > 0 && state.messages[i].timestamp === newItem.timestamp && newItem.type === "Recognized"){
                i --;
            } // handle edge case when the recognized subtitle comes after the translated subtitles.
            state.messages.splice(i + 1, 0, newItem); // Insert newItem right after the first item smaller than it
        },
        removeSelectedMessage: (state, action: PayloadAction<number>) => {
            state.messages = state.messages.filter(message => message.timestamp !== action.payload);
        },
        removeFirstMessage: (state) => {
            if (state.messages.length > 0) {
                state.messages.shift(); // Remove the first item of the array, acting as a deque
            }
        },
        setRecognizing: (state, action: PayloadAction<string>) => {
            state.recognizing = action.payload;
        },
        setRecognizingTranslation: (state, action: PayloadAction<string>) => {
            state.recognizingTranslation = action.payload;
        },
        resetContents: (state) => {
            // reset container to default
            state.messages = [];
            state.recognizing = "";
            state.recognizingTranslation = "";
        },
        resetSession: (state) => {
            // reset container to default
            state.sessionId = "";
            state.messages = [];
            state.recognizing = "";
            state.recognizingTranslation = "";
        }
        // Additional reducers can be added here
    },
});

export const {setSessionId, addMessage, removeSelectedMessage, removeFirstMessage, setRecognizing, setRecognizingTranslation, resetContents} = subtitleContainerSlide.actions;

export default subtitleContainerSlide.reducer;
