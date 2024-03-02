// Import the necessary modules from the generated files and grpc-web
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {SpeechRecognitionServiceInterfaceClient} from '../protos/SpeechrecognitionServiceClientPb';
import {
    CreateServiceRequest,
    RecognitionResponse,
    DeleteServiceRequest,
    KeepServiceAliveRequest, TranslationRequest
} from '../protos/speechrecognition_pb';
import {ClientReadableStream} from "grpc-web";


import {useSelector, useDispatch} from 'react-redux';
import {
    setLanguageOptions,
    setRecognitionLanguage,
    setTranslationLanguage,
    setRealtimeTranslation,
    setKeepSessionAlive
} from '../store/uiControlSlide';
import {
    setRecognizing,
    setRecognizingTranslation,
    resetContents,
    addMessage,
    setSessionId,
    Message
} from '../store/subtitleContainerSlide';
import {RootState} from '../store/store';


const SessionHandler: React.FC = () => {
    const dispatch = useDispatch();

    // Setup base const for Recognition Service
    const client = new SpeechRecognitionServiceInterfaceClient('http://localhost:5113', null, null);
    const responses = useSelector((state: RootState) => state.subtitleContainer.messages);
    const startService = useSelector((state: RootState) => state.uiControl.startService);


    const recognizingText = useSelector((state: RootState) => state.subtitleContainer.recognizing);
    const streamRef = useRef<ClientReadableStream<RecognitionResponse> | null>(null);
    const sessionId = useSelector((state: RootState) => state.subtitleContainer.sessionId);
    const keepAliveEnabled = useSelector((state: RootState) => state.uiControl.keepSessionAlive);
    const keepAliveRef = useRef<NodeJS.Timeout | null>(null);

    // Set up for languages dropdowns
    const selectedRecognitionLanguage = useSelector((state: RootState) => state.uiControl.selectedRecognitionLanguage);
    const selectedTranslationLanguage = useSelector((state: RootState) => state.uiControl.selectedTranslationLanguage);

    const languages = useSelector((state: RootState) => state.uiControl.recognitionLanguages);
    useEffect(() => {
        var jsonPath = process.env.PUBLIC_URL + '/language-supports.json';
        if (window && window.process && (window.process as any).type) {
            // Running in Electron, adjust the path for production
            const {app} = window.require('electron').remote;
            jsonPath = `${app.getAppPath()}/public${jsonPath}`;
        }
        console.log(jsonPath)
        // Fetch language configuration on component mount
        fetch(jsonPath)
            .then(response => response.json())
            .then(data => dispatch(setLanguageOptions(data))) // Set to global Language Options
            .catch(error => console.error('Error loading lan' +
                'guage configuration:', error));
        console.log(languages)
    }, []);


    // Set up Realtime Translation
    const recognizingTranslationText = useSelector((state: RootState) => state.subtitleContainer.recognizingTranslation);
    const recognizingTextRef = useRef('');
    const lastSentForTranslationRef = useRef('');
    const enableRealtimeTranslation = useSelector((state: RootState) => state.uiControl.realtimeTranslation);
    const translateIntervalRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        recognizingTextRef.current = recognizingText;
    }, [recognizingText]);


    // Functions for Realtime Translation
    const getTranslation = () => {
        if (recognizingTextRef.current && recognizingTextRef.current !== lastSentForTranslationRef.current) {
            const request = new TranslationRequest();
            request.setText(recognizingTextRef.current);
            request.setLanguage(selectedRecognitionLanguage);
            request.setTranslateLanguage(selectedTranslationLanguage);

            client.getTranslation(request, {}, (err, response) => {
                if (err) {
                    console.error('Error getting translation:', err);
                    return;
                }
                // Handle the translation response here
                console.log('Recognizing Translation:', response.getText());
                dispatch(setRecognizingTranslation(response.getText()));
            });
            lastSentForTranslationRef.current = recognizingTextRef.current;
        }
    };

    useEffect(() => {
        if (enableRealtimeTranslation) {
            // Start the interval for translation when toggled on
            translateIntervalRef.current = setInterval(getTranslation, 2000);
        } else {
            // Clear the interval when toggled off or component unmounts
            if (translateIntervalRef.current) {
                clearInterval(translateIntervalRef.current);
                translateIntervalRef.current = null;
            }
            dispatch(setRecognizingTranslation(''));
        }
        return () => {
            // Cleanup interval on unmount
            if (translateIntervalRef.current) {
                clearInterval(translateIntervalRef.current);
            }
        };
    }, [enableRealtimeTranslation, selectedTranslationLanguage, selectedRecognitionLanguage]);

    // Functions for Recognition Service

    const createService = () => {
        const request = new CreateServiceRequest();
        request.setLanguage(selectedRecognitionLanguage);
        request.setTranslateLanguage(selectedTranslationLanguage);

        const stream = client.createService(request, {});
        streamRef.current = stream; // Assign the stream to the ref for later access

        stream.on('data', (response) => {
            // Handle each message received from the server
            console.log(response.getText(), response.getType());  // Adjust based on your actual response structure
            console.log(response.getText(), response.getType()); // Log for debugging
            const message: Message = {
                text: response.getText(),
                type: response.getType(),
                timestamp: response.getTimestamp()
            }
            if (response.getType() === "SessionId") {
                dispatch(setSessionId(response.getText())); // Memorize the session ID
            } else if (response.getType() === "Recognizing") {
                dispatch(setRecognizing(response.getText()));
            } else if (response.getType() === "Recognized") {
                dispatch(addMessage(message));
            } else if (response.getType() === "Translated") {
                dispatch(addMessage(message));
            }
        });

        stream.on('error', (err) => {
            console.error('Stream encountered an error:', err);
        });

        stream.on('end', () => {
            // Handle stream end
            console.log('Stream ended.');
        });
    };

    const deleteService = () => {
        dispatch(setKeepSessionAlive(false));
        dispatch(setRealtimeTranslation(false));
        if (!sessionId) {
            // console.error('No session ID available to delete.');
            return null;
        }

        const request = new DeleteServiceRequest();
        request.setId(sessionId);

        client.deleteService(request, {}, (err, response) => {
            if (err) {
                console.error('Error deleting service:', err);
            } else {
                console.log('Service deleted successfully.');
            }
        });

        // Reset state
        dispatch(setSessionId(''));
        if (streamRef.current) {
            streamRef.current.cancel(); // Ensure to cancel the current stream
        }
    };

    useEffect(() => {
        // Cleanup function to cancel the stream when the component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.cancel();
            }
        };
    }, []); // Empty dependency array means this effect runs only on mount and cleanup on unmount

    useEffect(() => {
        if (startService) {
            createService();
        } else {
            deleteService();
        }
    }, [startService]);

    useEffect(() => {
        if (keepAliveEnabled && sessionId) {
            // Send a KeepServiceAlive request every 10 seconds
            keepAliveRef.current = setInterval(() => {
                const request = new KeepServiceAliveRequest();
                request.setId(sessionId);
                client.keepServiceAlive(request, {}, (err, response) => {
                    if (err) {
                        console.error('Error sending KeepServiceAlive:', err);
                    } else {
                        console.log('KeepServiceAlive request sent successfully.');
                    }
                });
            }, 10000);
        } else {
            // Clear the interval if keepAliveEnabled is false or sessionId is empty
            if (keepAliveRef.current) {
                clearInterval(keepAliveRef.current);
            }
        }

        // Cleanup interval on unmount or when sessionId changes
        return () => {
            if (keepAliveRef.current) {
                clearInterval(keepAliveRef.current);
            }
        };
    }, [keepAliveEnabled, sessionId]);

    return null;
}

export default SessionHandler;