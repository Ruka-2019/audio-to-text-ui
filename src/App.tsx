import React from 'react';
import { HashRouter  as Router, Routes, Route, Link } from 'react-router-dom';

import MenuPage from './pages/MenuPage';
import ExamplePage from './pages/ExamplePage';
import ChatRoomPage from './pages/ChatRoomPage';
import MainPage from './pages/MainPage'
import SessionHandler from './pages/SessionHandler';
// import ContentPage from '../pages/ContentPage';

const App: React.FC = () => {
    return (
        <Router>
            {/*Global behind Scene components*/}
            <SessionHandler />
            {/*Route Settings*/}
            <Routes>
                <Route path="/" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App;
