import { app, BrowserWindow, ipcMain } from 'electron';
// import path from 'path';
import path from 'path';
// import * as fs from 'fs';
// const path = require('path');
// import os from 'os';
// const os = require('os');
import Listeners from './ipcListeners';
// needed in case process is undefined under Linux
// const platform = process.platform || os.platform();

// app.allowRendererProcessReuse = true;

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

  new Listeners(mainWindow, app);

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(() => {
  createWindow();
  console.log(app.getPath('appData'));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});

ipcMain.on('greet', (event, args) => {
  console.log(args);
});
