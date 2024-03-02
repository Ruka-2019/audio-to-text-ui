const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  // maximizeWindow: () => ipcRenderer.send('maximize-window'),
  toggleMaximizeWindow: () => ipcRenderer.send('toggle-maximize-window'),
  isElectron: () => true,
});
