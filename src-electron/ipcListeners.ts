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
      if (url.startsWith('open-java-page://')) {
        event.preventDefault();
        shell.openExternal('https://www.java.com/en/download/manual.jsp');
      } else if (url.startsWith('open-jdk-page://')) {
        event.preventDefault();
        switch (process.platform) {
          case 'win32':
            shell.openExternal(
              'https://www.oracle.com/java/technologies/downloads/#jdk21-windows'
            );
            break;
          case 'darwin':
            shell.openExternal(
              'https://www.oracle.com/java/technologies/downloads/#jdk21-mac'
            );
            break;
          case 'linux':
            shell.openExternal(
              'https://www.oracle.com/java/technologies/downloads/#jdk21-linux'
            );
            break;
          default:
            shell.openExternal(
              'https://www.oracle.com/java/technologies/downloads/#java21'
            );
            break;
        }
      }
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

ipcMain.handle('checkJava', () => {
  return new Promise((resolve, reject) => {
    exec(
      'java -version',
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) reject(error);
        else resolve(stdout || stderr);
      }
    );
  });
});

ipcMain.handle('execute', (_event, cmd) => {
  console.log(`Executing command: ${cmd}`);
  exec(cmd);
});

ipcMain.handle(
  'checkJDK',
  () =>
    new Promise<number | string>((resolve) => {
      exec(
        'java -version',
        (error: Error | null, stdout: string, stderr: string) => {
          if (error) resolve(0); // Resolve with 0 on error
          else {
            const match = stderr.match(/version "(.*?)"/);
            const javaVersion = match ? match[1] : null;
            console.log(`Java Version found: ${javaVersion}!`);
            if (javaVersion)
              resolve(parseInt(javaVersion)); // Resolve with the JDK version
            else resolve(0); // Resolve with 0 if the version cannot be determined
          }
        }
      );
    })
);
