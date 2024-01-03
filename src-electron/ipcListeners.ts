import { ipcMain, BrowserWindow, app as ElectronApp } from 'electron';
// import path from 'path';
// console.log('IPC Listener');
let browserWindow: BrowserWindow;
let app: typeof ElectronApp;

export default class Listeners {
  constructor(window: BrowserWindow, electronApp: typeof ElectronApp) {
    browserWindow = window;
    app = electronApp;
  }
}

ipcMain.handle('getAppPath', () => app.getAppPath());
ipcMain.handle('getAppDataPath', () => app.getPath('appData'));
