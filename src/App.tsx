import React from 'react';
import { HashRouter  as Router, Routes, Route, Link } from 'react-router-dom';


import MainPage from './pages/MainPage'
import SessionHandler from './pages/SessionHandler';

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
