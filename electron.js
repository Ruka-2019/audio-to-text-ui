const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
let isDev;
import('electron-is-dev').then((module) => {
  isDev = module.default;
});

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,// Make the window transparent
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: false,
      contextIsolation: true, // For newer versions of Electron, set this to true and use a preload script
      enableRemoteModule: true, // Consider security implications of enabling remote module
      // Make sure JavaScript is enabled
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './build/index.html')}`;
  win.loadURL(startUrl);

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }
  // win.webContents.openDevTools();

  // Close window action
  ipcMain.on('close-window', () => {
    if (win) win.close();
  });

  // Minimize window action
  ipcMain.on('minimize-window', () => {
    if (win) win.minimize();
  });

  // Maximize window action
  ipcMain.on('maximize-window', () => {
    if (win) win.maximize();
  });

  // Maximize window action
  ipcMain.on('restore-window', () => {
    if (win) win.restore();
  });

  let prevBounds;
  ipcMain.on('toggle-maximize-window', () => {
    const window = BrowserWindow.getFocusedWindow();
    console.log('Current maximized state:', window.isMaximized()); // Debug log
    if (window) {
      if (window.isMaximized()) {
        console.log('Restoring window'); // Debug log
        window.setBounds(prevBounds);
        window.restore();
      } else {
        console.log('Maximizing window'); // Debug log
        prevBounds = window.getBounds();
        window.maximize();
      }
    }
  });
}

app.on('ready', createWindow);



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
