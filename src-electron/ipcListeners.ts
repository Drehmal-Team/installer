import {
  ipcMain,
  BrowserWindow,
  app as ElectronApp,
  shell as ElectronShell,
} from 'electron';
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
