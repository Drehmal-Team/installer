import {
  ipcMain,
  BrowserWindow,
  app as ElectronApp,
  shell as ElectronShell,
} from 'electron';
const path = require('path');
const { execFile, spawn } = require('child_process');
import log from 'electron-log';
// import path from 'path';
// log.info('IPC Listener');
let browserWindow: BrowserWindow;
let app: typeof ElectronApp;
let shell: typeof ElectronShell;

export default class Listeners {
  constructor(
    window: BrowserWindow,
    electronApp: typeof ElectronApp,
    electronShell: typeof ElectronShell
  ) {
    browserWindow = window;
    app = electronApp;
    shell = electronShell;
  }
}

ipcMain.handle('getAppPath', () => app.getAppPath());
ipcMain.handle('getAppDataPath', () => app.getPath('appData'));
ipcMain.handle('openInBrowser', (_event, url) => shell.openExternal(url));
ipcMain.handle('quit', () => app.quit());
ipcMain.handle('getPlatform', () => process.platform);
ipcMain.handle('minecraftWin', (_event, path) => {
  spawn(path);
});
ipcMain.handle('minecraftNotWin', () => {
  spawn('minecraft-launcher');
});
