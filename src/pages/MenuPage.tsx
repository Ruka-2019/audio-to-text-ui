// MenuPage.tsx
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, Typography, SelectChangeEvent, Slider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Remove';
import MaximizeIcon from '@mui/icons-material/CropSquare';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "store/store";
import {
    setLanguageOptions,
    setRecognitionLanguage,
    setTranslationLanguage,
    setRealtimeTranslation,
    setKeepSessionAlive, setStartService, setTransparency
} from '../store/uiControlSlide';
import {
    resetContents, setRecognizing, setRecognizingTranslation,
} from '../store/subtitleContainerSlide';

const MenuPage: React.FC = () => {
    const dispatch = useDispatch();
    const sessionId = useSelector((state: RootState) => state.subtitleContainer.sessionId);
    const keepAliveEnabled = useSelector((state: RootState) => state.uiControl.keepSessionAlive);
    const startService = useSelector((state: RootState) => state.uiControl.startService);
    const enableRealtimeTranslation = useSelector((state: RootState) => state.uiControl.realtimeTranslation);

    const recognitionLanguageOptions =  useSelector((state: RootState) => state.uiControl.recognitionLanguages);
    const translationLanguageOptions =  useSelector((state: RootState) => state.uiControl.translationLanguages);


    const toggleKeepAlive = () => {
        dispatch(setKeepSessionAlive(!keepAliveEnabled));
    };

    const toggleTranslation = () => {
        dispatch(setRealtimeTranslation(!enableRealtimeTranslation));
    };

    const selectedRecognitionLanguage = useSelector((state: RootState) => state.uiControl.selectedRecognitionLanguage);
    const selectedTranslationLanguage = useSelector((state: RootState) => state.uiControl.selectedTranslationLanguage);

    // Adjusted the event type here to SelectChangeEvent<string>
    const handleSelectedRecognitionLanguage = (event: SelectChangeEvent<string>) => {
        dispatch(setRecognitionLanguage(event.target.value))
    };

    const handleSelectedTranslationLanguage = (event: SelectChangeEvent<string>) => {
        dispatch(setTranslationLanguage(event.target.value))
    };

    const startSession = () => {
        dispatch(setStartService(true));
    };

    const starSessionAndKeepAlive = () => {
        dispatch(setStartService(true));
        dispatch(setKeepSessionAlive(true));
    }

    const stopSession = () => {
        dispatch(setStartService(false));
    };

    const clearAllContent = () => {
        dispatch(resetContents());
        dispatch(setRecognizing(''));
        dispatch(setRecognizingTranslation(''));
    };

    const transparency = useSelector((state: RootState) => state.uiControl.transparency);

    const handleTransparencyChange = (event: Event, newValue: number | number[]) => {
        dispatch(setTransparency(newValue as number));
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <Typography variant="h6" className="text-lg font-semibold text-gray-900 mb-4">Settings</Typography>
            <Typography className="mb-2">Current Session Id: {sessionId}</Typography>

            <div className="mb-4">
                <FormControl fullWidth margin="normal" variant="outlined" className="mt-1">
                    <InputLabel id="recognition-language-label">Recognition Language</InputLabel>
                    <Select
                        labelId="recognition-language-label"
                        id="recognition-language-select"
                        value={selectedRecognitionLanguage}
                        onChange={handleSelectedRecognitionLanguage}
                        label="Recognition Language"
                        className="bg-gray-50 border-gray-300 text-gray-900"
                    >
                        {recognitionLanguageOptions.map(language => (
                            <MenuItem key={language.code} value={language.code}>{language.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="mb-4">
                <FormControl fullWidth margin="normal" variant="outlined" className="mt-1">
                    <InputLabel id="translation-language-label">Translation Language</InputLabel>
                    <Select
                        labelId="translation-language-label"
                        id="translation-language-select"
                        value={selectedTranslationLanguage}
                        onChange={handleSelectedTranslationLanguage}
                        label="Translation Language"
                        className="bg-gray-50 border-gray-300 text-gray-900"
                    >
                        {translationLanguageOptions.map(language => (
                            <MenuItem key={language.code} value={language.code}>{language.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="flex flex-col space-y-2 mb-4">
                <Button variant="contained" color="primary" disabled={!!sessionId} onClick={starSessionAndKeepAlive}>
                    Start Session
                </Button>
                <Button variant="contained" color="primary" disabled={!sessionId} onClick={stopSession}>
                    Stop Session
                </Button>
                {/*<Button variant="contained" color="primary" disabled={!sessionId} onClick={toggleKeepAlive}>*/}
                {/*    {keepAliveEnabled ? 'Disable Keep Alive' : 'Enable Keep Alive'}*/}
                {/*</Button>*/}
                <Button variant="contained" color="primary" disabled={!sessionId} onClick={toggleTranslation}>
                    {enableRealtimeTranslation ? 'Stop Realtime Translation' : 'Start Realtime Translation'}
                </Button>
                <Button variant="contained" color="primary" onClick={clearAllContent}>
                    Clear All Content
                </Button>
            </div>

            <div className="flex flex-col space-y-2">
                <Typography>Transparency Control</Typography>
                <Slider
                    value={transparency}
                    onChange={handleTransparencyChange}
                    min={0}
                    max={1}
                    step={0.01}
                    aria-labelledby="transparency-slider"
                />
            </div>
        </div>


    );
};

export default MenuPage;
