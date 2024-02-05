const { exec } = require('child_process');
import {
  BrowserWindow,
  app as ElectronApp,
  dialog as ElectronDialog,
  shell as ElectronShell,
  ipcMain,
} from 'electron';
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

let browserWindow: BrowserWindow;
let app: typeof ElectronApp;
let shell: typeof ElectronShell;
let dialog: typeof ElectronDialog;

export default class Listeners {
  constructor(
    window: BrowserWindow,
    electronApp: typeof ElectronApp,
    electronShell: typeof ElectronShell,
    electronDialog: typeof ElectronDialog
  ) {
    browserWindow = window;
    app = electronApp;
    shell = electronShell;
    dialog = electronDialog;

    browserWindow.webContents.on('will-navigate', (event, url) => {
      // For custom URLs, use the following (must be above generic openExternal)
      // if (url.startsWith('open-java-page://')) {
      //   event.preventDefault();
      //   shell.openExternal('https://www.java.com/en/download/manual.jsp');
      // }
      // Will be used with: <a href="open-java-page://">Java Downloads Page</a>

      // To open URLs in an external browser
      event.preventDefault();
      shell.openExternal(url);
    });
  }
}

ipcMain.handle('getAppPath', () => app.getAppPath());
ipcMain.handle('getAppDataPath', () => app.getPath('appData'));
ipcMain.handle('getDesktopPath', () => app.getPath('desktop'));
ipcMain.handle('openInBrowser', (_event, url) => shell.openExternal(url));
ipcMain.handle('quit', () => app.quit());
ipcMain.handle('getPlatform', () => process.platform);

ipcMain.handle('getPlatformPretty', () => {
  switch (process.platform) {
    case 'win32':
      return 'Windows';
    case 'darwin':
      return 'MacOS';
    case 'linux':
      return 'Linux';
  }
});

ipcMain.handle('getArch', () => os.arch());

ipcMain.handle('minecraftWin', (_event, path) => {
  spawn(path);
});

ipcMain.handle('minecraftNotWin', () => {
  spawn('minecraft-launcher');
});

/*
Linux: /home/<USER>/.minecraft
Mac: /Library/Application Support/minecraft
Windows: C:\Users\<USER>\AppData\Roaming\.minecraft
*/
ipcMain.handle('getMinecraftPath', () => {
  switch (process.platform) {
    case 'win32':
      return path.join(app.getPath('appData'), '.minecraft');
    case 'darwin':
      return path.join(
        os.homedir(),
        'Library',
        'Application Support',
        'minecraft'
      );
    case 'linux':
      return path.join(os.homedir(), '.minecraft');
  }
});
ipcMain.handle('getDrehmalPath', () => {
  switch (process.platform) {
    case 'win32':
      return path.join(app.getPath('appData'), '.minecraft_drehmal');
    case 'darwin':
      return path.join(
        os.homedir(),
        'Library',
        'Application Support',
        'minecraft_drehmal'
      );
    case 'linux':
      return path.join(os.homedir(), '.minecraft_drehmal');
  }
});

ipcMain.handle(
  'openFileDialog',
  async () =>
    await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
);

ipcMain.handle('execute', (_event, cmd) => {
  console.log(`Executing command: ${cmd}`);
  exec(cmd);
});
