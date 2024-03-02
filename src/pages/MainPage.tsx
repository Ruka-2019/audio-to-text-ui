import React, {useState, useEffect, useRef} from 'react';
import {TextField, IconButton, Fab, Paper, Typography, Modal, Box} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MenuIcon from '@mui/icons-material/Menu';
import MenuPage from './MenuPage';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "store/store";

interface Message {
    id: number;
    text: string;
}

const MainPage: React.FC = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state: RootState) => state.subtitleContainer.messages);
    const realTimeSubtitle = useSelector((state: RootState) => state.subtitleContainer.recognizing);
    const realTimeTranslation = useSelector((state: RootState) => state.subtitleContainer.recognizingTranslation);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
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

    const transparency = useSelector((state: RootState) => state.uiControl.transparency);

    // Calculate transparency styles based on slider value
    const backgroundTransparencyStyle = {
        backgroundColor: `rgba(255, 255, 255, ${transparency})`, // Adjust background transparency
    };

    const elementTransparencyStyle = {
        opacity: 0.5 + (transparency * 0.5), // Adjust element opacity to 50% when transparency is less than 1
    };

    const containerBackgroundStyle = {
        backgroundColor: `rgba(210, 210, 210, ${0.3 + transparency * 0.7})`, // Use transparency for background
    };

    const subtitleBackgroundStyle = {
        backgroundColor: `rgba(0, 200, 255, ${0.3 + transparency * 0.7})`, // Use transparency for background
    };

    const translateBackgroundStyle = {
        backgroundColor: `rgba(144, 238, 144, ${0.3 + transparency * 0.7})`, // Use transparency for background
    };

    const textStyle = {
        color: 'black', // Ensure text color provides enough contrast
    };

    return (
        <div className="flex flex-col h-screen draggable-area" style={backgroundTransparencyStyle}>
            <div ref={messageContainerRef} className="flex-grow overflow-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className="rounded-md p-2 max-w-3/4 mx-auto my-1"
                         style={message.type === "Translated" ? {...translateBackgroundStyle, width: 'fit-content', maxWidth: '75%'} : {...subtitleBackgroundStyle, width: 'fit-content', maxWidth: '75%'}}>
                        <span className="text-sm md:text-base" style={textStyle}>{message.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} style={{height: 1, margin: -1}}/>
            </div>
            {realTimeSubtitle && (
                <Paper elevation={3} style={{...containerBackgroundStyle, padding: '10px 20px', margin: '10px'}}>
                    <Typography variant="body1" style={textStyle}>{realTimeSubtitle}</Typography>
                </Paper>
            )}
            {realTimeTranslation && (
                <Paper elevation={3} style={{...containerBackgroundStyle, padding: '10px 20px', margin: '10px'}}>
                    <Typography variant="body1" style={textStyle}>{realTimeTranslation}</Typography>
                </Paper>
            )}
            {showScrollButton && (
                <Fab color="primary" aria-label="scroll down" style={{...elementTransparencyStyle, position: 'fixed', right: 20, bottom: 20}}
                     onClick={scrollToBottom}>
                    <ArrowDownwardIcon/>
                </Fab>
            )}
            <Fab color="primary" aria-label="menu" style={{...elementTransparencyStyle, position: 'fixed', right: 20, top: 20}}
                 onClick={handleOpenMenu}>
                <MenuIcon/>
            </Fab>
            <Modal
                open={openMenu}
                onClose={handleCloseMenu}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <MenuPage/>
                </Box>
            </Modal>
        </div>
    );
};

export default MainPage;
