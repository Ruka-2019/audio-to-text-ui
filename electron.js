const { app, BrowserWindow } = require('electron');
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
    },
  });

  // and load the index.html of the app.
  const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './build/index.html')}`;
  win.loadURL(startUrl);

  // Open the DevTools.
  // if (isDev) {
  //   win.webContents.openDevTools();
  // }
  win.webContents.openDevTools();
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
