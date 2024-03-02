// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import sendMessageReducer, {sendMessageSlice} from './sendMessageSlice';
import subtitleContainerReducer from './subtitleContainerSlide';
import uiControlReducer from "./uiControlSlide";

export const store = configureStore({
    reducer: {
        sendMessage: sendMessageReducer,
        subtitleContainer: subtitleContainerReducer,
        uiControl: uiControlReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
