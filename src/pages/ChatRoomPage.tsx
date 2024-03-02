import React, { useState, useEffect, useRef } from 'react';
import { TextField, IconButton, Fab, Paper, Typography, Modal, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MenuIcon from '@mui/icons-material/Menu';
import MenuPage from './MenuPage';

interface Message {
    id: number;
    text: string;
}

const ChatRoomPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [systemMessage, setSystemMessage] = useState('Welcome to the chat room!');

    const handleSend = () => {
        if (inputText.trim() !== '') {
            const newMessage: Message = {
                id: messages.length + 1,
                text: inputText,
            };
            setMessages([...messages, newMessage]);
            setInputText('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setShowScrollButton(false);
    };

    useEffect(() => {
        if (messages.length < 4) {
            scrollToBottom();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    scrollToBottom();
                } else {
                    setShowScrollButton(true);
                }
            },
            {
                root: messageContainerRef.current,
                threshold: 1.0,
            }
        );

        const targetMessage = messagesEndRef.current?.parentNode?.childNodes[messages.length - 4];
        if (targetMessage) {
            observer.observe(targetMessage as Element);
        }

        return () => {
            if (targetMessage) {
                observer.unobserve(targetMessage as Element);
            }
        };
    }, [messages]);


    // Menu Components
    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenMenu = () => setOpenMenu(true);
    const handleCloseMenu = () => setOpenMenu(false);

    // Modal styles
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };



    return (
        <div className="flex flex-col h-screen">
            <div ref={messageContainerRef} className="flex-grow overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className="bg-gray-100 rounded-md p-2 max-w-3/4 mx-auto my-1" style={{ width: 'fit-content', maxWidth: '75%' }}>
                        <span className="text-sm md:text-base">{message.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} style={{ height: 1, margin: -1 }} />
            </div>
            <Paper elevation={3} style={{ padding: '10px 20px', margin: '10px', backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1">{systemMessage}</Typography>
            </Paper>
            {showScrollButton && (
                <Fab color="primary" aria-label="scroll down" style={{ position: 'fixed', right: 20, bottom: 20 }} onClick={scrollToBottom}>
                    <ArrowDownwardIcon />
                </Fab>
            )}
            <Fab color="primary" aria-label="menu" style={{ position: 'fixed', right: 20, bottom: 20 }} onClick={handleOpenMenu}>
                <MenuIcon />
            </Fab>
            <Modal
                open={openMenu}
                onClose={handleCloseMenu}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <MenuPage />
                </Box>
            </Modal>

            <div className="p-4">
                <div className="flex gap-4">
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message"
                    />
                    <IconButton color="primary" onClick={handleSend}>
                        <SendIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ChatRoomPage;
