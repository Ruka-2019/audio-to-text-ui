import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Language {
    code: string;
    name: string;
}

interface LanguageOptions {
    recognitionLanguages: Language[];
    translationLanguages: Language[]
}

interface UiControlSlide {
    startService: boolean,
    realtimeTranslation: boolean,
    keepSessionAlive: boolean,
    recognitionLanguages: Language[],
    translationLanguages: Language[],
    selectedRecognitionLanguage: string,
    selectedTranslationLanguage: string,
    transparency: number,

}

const initialState: UiControlSlide = {
    startService: false,
    realtimeTranslation: false,
    keepSessionAlive: false,
    recognitionLanguages: [],
    translationLanguages: [],
    selectedRecognitionLanguage: "en-US",
    selectedTranslationLanguage: "zh-TW",
    transparency: 1
}

export const uiControlSlide = createSlice({
    name: "uiControl",
    initialState,
    reducers: {
        setStartService: (state, action: PayloadAction<boolean>) => {
            state.startService = action.payload;
        },
        setRealtimeTranslation: (state, action: PayloadAction<boolean>) => {
            state.realtimeTranslation = action.payload;
        },
        setKeepSessionAlive: (state, action: PayloadAction<boolean>) => {
            state.keepSessionAlive = action.payload;
        },
        setLanguageOptions: (state, action: PayloadAction<LanguageOptions>) => {
            state.recognitionLanguages = action.payload.recognitionLanguages;
            state.translationLanguages = action.payload.translationLanguages;
        },
        setRecognitionLanguage: (state, action: PayloadAction<string>) => {
            state.selectedRecognitionLanguage = action.payload;
        },
        setTranslationLanguage: (state, action: PayloadAction<string>) => {
            state.selectedTranslationLanguage = action.payload;
        },
        setTransparency: (state, action: PayloadAction<number>) => {
            state.transparency = action.payload;
        },
    }
});

export const { setStartService, setRealtimeTranslation, setKeepSessionAlive, setLanguageOptions, setRecognitionLanguage, setTranslationLanguage, setTransparency } = uiControlSlide.actions;
export default uiControlSlide.reducer;
