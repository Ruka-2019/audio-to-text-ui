// Import the necessary modules from the generated files and grpc-web
import React, {useEffect, useState, useRef} from 'react';
import {SpeechRecognitionServiceInterfaceClient} from './protos/SpeechrecognitionServiceClientPb';
import {
    CreateServiceRequest,
    RecognitionResponse,
    DeleteServiceRequest,
    KeepServiceAliveRequest, TranslationRequest
} from './protos/speechrecognition_pb';
import {ClientReadableStream} from "grpc-web";

interface Language {
    code: string;
    name: string;
}

function App() {

    // Setup base const for Recognition Service
    const [responses, setResponses] = useState<string[]>([]);
    const [translates, setTranslates] = useState<string[]>([]);
    const [recognizingText, setRecognizingText] = useState('');
    const streamRef = useRef<ClientReadableStream<RecognitionResponse> | null>(null);
    const [sessionId, setSessionId] = useState('');
    const [keepAliveEnabled, setKeepAliveEnabled] = useState(false);
    const keepAliveRef = useRef<NodeJS.Timeout | null>(null);

    // Set up for languages dropdowns
    const [selectedRecognitionLanguage, setSelectedRecognitionLanguage] = useState('en-US');
    const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState('zh-TW');
    const [languages, setLanguages] = useState<{ recognitionLanguages: Language[]; translationLanguages: Language[] }>({
        recognitionLanguages: [],
        translationLanguages: []
    });
    useEffect(() => {
        // Fetch language configuration on component mount
        fetch('/language-supports.json')
            .then(response => response.json())
            .then(data => setLanguages(data))
            .catch(error => console.error('Error loading language configuration:', error));
    }, []);

    // Set up Realtime Translation
    const [recognizingTranslationText, setRecognizingTranslationText] = useState('');
    const recognizingTextRef = useRef('');
    const lastSentForTranslationRef = useRef('');
    const [isTranslationActive, setIsTranslationActive] = useState(false);
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
                setRecognizingTranslationText(response.getText())
            });

            lastSentForTranslationRef.current = recognizingTextRef.current;
        }
    };

    const toggleTranslation = () => {
        setIsTranslationActive(!isTranslationActive);
    };

    useEffect(() => {
        if (isTranslationActive) {
            // Start the interval for translation when toggled on
            translateIntervalRef.current = setInterval(getTranslation, 2000);
        } else {
            // Clear the interval when toggled off or component unmounts
            if (translateIntervalRef.current) {
                clearInterval(translateIntervalRef.current);
                translateIntervalRef.current = null;
            }
            setRecognizingTranslationText('');
        }

        return () => {
            // Cleanup interval on unmount
            if (translateIntervalRef.current) {
                clearInterval(translateIntervalRef.current);
            }
        };
    }, [isTranslationActive, selectedTranslationLanguage, selectedRecognitionLanguage]);

    // Functions for UI elements

    const clearAllContent = () => {
        setResponses([]);
        setTranslates([]);
        setRecognizingText('');
        setRecognizingTranslationText('');
    };

    // Functions for Recognition Service

    const client = new SpeechRecognitionServiceInterfaceClient('http://localhost:5113', null, null);

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
            if (response.getType() === "SessionId") {
                setSessionId(response.getText()); // Memorize the session ID
            } else if (response.getType() === "Recognizing") {
                setRecognizingText(_ => `${response.getText()}`);
            } else if (response.getType() === "Recognized") {
                setResponses(prevResponses => [...prevResponses, response.getText()]);
            } else if (response.getType() === "Translated") {
                setTranslates(prevResponses => [...prevResponses, response.getText()]);
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
        setKeepAliveEnabled(false);
        setIsTranslationActive(false);
        if (!sessionId) {
            console.error('No session ID available to delete.');
            return;
        }

        const request = new DeleteServiceRequest();
        request.setId(sessionId);

        client.deleteService(request, {}, (err, response) => {
            if (err) {
                console.error('Error deleting service:', err);
            } else {
                console.log('Service deleted successfully.');
                setRecognizingText(''); // Update UI to reflect the service has been terminated
            }
        });

        // Reset state
        setSessionId('');
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

    const toggleKeepAlive = () => {
        setKeepAliveEnabled(!keepAliveEnabled);
    };

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

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <label htmlFor="recognitionLanguage">Recognition Language:</label>
                    <select
                        id="recognitionLanguage"
                        value={selectedRecognitionLanguage}
                        onChange={(e) => setSelectedRecognitionLanguage(e.target.value)}
                    >
                        {languages.recognitionLanguages.map(language => (
                            <option key={language.code} value={language.code}>{language.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="translationLanguage">Translation Language:</label>
                    <select
                        id="translationLanguage"
                        value={selectedTranslationLanguage}
                        onChange={(e) => setSelectedTranslationLanguage(e.target.value)}
                    >
                        {languages.translationLanguages.map(language => (
                            <option key={language.code} value={language.code}>{language.name}</option>
                        ))}
                    </select>
                </div>

                <button onClick={createService} disabled={!!sessionId}>Start Recognition</button>
                <button onClick={deleteService} disabled={!sessionId}>Stop Recognition</button>
                <button onClick={toggleKeepAlive} disabled={!sessionId}>
                    {keepAliveEnabled ? 'Disable Keep Alive' : 'Enable Keep Alive'}
                </button>
                <button onClick={toggleTranslation}>
                    {isTranslationActive ? 'Stop Active Translation' : 'Start Active Translation'}
                </button>
                <button onClick={clearAllContent}>Clear All Content</button>
                <p>SessionId: {sessionId}</p>
                <div>Responses:
                    {/* Map over the responses array to render each item as a separate line */}
                    {responses.map((text, index) => (
                        <p key={index}>{text}</p>
                    ))}
                </div>
                <div>Translates:
                    {/* Map over the responses array to render each item as a separate line */}
                    {translates.map((text, index) => (
                        <p key={index}>{text}</p>
                    ))}
                </div>
                <p>Reconizing: {recognizingText}</p>
                <p>Reconizing Translation: {recognizingTranslationText}</p>
            </header>
        </div>
    );
}

export default App;
