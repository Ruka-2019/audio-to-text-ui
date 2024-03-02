// MenuPage.tsx
import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Remove';
import MaximizeIcon from '@mui/icons-material/CropSquare';
import {useDispatch} from "react-redux";

const BarPage: React.FC = () => {
    const dispatch = useDispatch();

    // function for electron application windows

    const handleClose = () => {
        if (isElectron()) {
            console.log('close window...')
            window.electronAPI.closeWindow();
        }
    };
    const handleMinimize = () => {
        if (isElectron()) {
            console.log('minimize window...')
            window.electronAPI.minimizeWindow();
        }
    };

    const handleMaximize = () => {
        if (isElectron()) {
            console.log('maximize window...')
            window.electronAPI.maximizeWindow();
        }
    };
    const isElectron = () => {
        return window.electronAPI && window.electronAPI.isElectron();
    };


    return isElectron() ?
      (<div className="mini-bar draggable-area" style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
        <div className="window-controls non-draggable-area">
          <IconButton aria-label="minimize" onClick={() => window.electronAPI.minimizeWindow()}>
            <MinimizeIcon/>
          </IconButton>
          <IconButton aria-label="maximize" onClick={() => window.electronAPI.toggleMaximizeWindow()}>
            <MaximizeIcon/>
          </IconButton>
          <IconButton aria-label="close" onClick={() => window.electronAPI.closeWindow()}>
            <CloseIcon/>
          </IconButton>
        </div>
      </div>) : null;
};

export default BarPage;
