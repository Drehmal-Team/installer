import {
  ipcMain,
  BrowserWindow,
  app as ElectronApp,
  shell as ElectronShell,
} from 'electron';
const { spawn } = require('child_process');

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
ipcMain.handle('getDesktopPath', () => app.getPath('desktop'));
ipcMain.handle('openInBrowser', (_event, url) => shell.openExternal(url));
ipcMain.handle('quit', () => app.quit());
ipcMain.handle('getPlatform', () => process.platform);
ipcMain.handle('minecraftWin', (_event, path) => {
  spawn(path);
});
ipcMain.handle('minecraftNotWin', () => {
  spawn('minecraft-launcher');
});
