import dayjs from 'dayjs';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import log from 'electron-log';
import Listeners from './ipcListeners';
const path = require('path');
const os = require('os');

import { version } from '../package.json';

// Optional, initialize the logger for any renderer process
log.initialize({ spyRendererConsole: true });
const currDate = dayjs().format('DD-MM-YYYY');

const logFolder = path.join(
  process.platform === 'win32' ? app.getPath('appData') : os.homedir(),
  'Drehmal Installer',
  'logs'
);

log.transports.file.resolvePathFn = () =>
  path.join(logFolder, `${currDate}-installer.log`);
log.transports.file.format = '[{h}:{i}:{s}.{ms}] [{level}] {text}';

// initialise logger for uncaught execptions
log.errorHandler.startCatching();
log.eventLogger.startLogging();

log.info(
  `Installer v${version} (${process.platform} ${os.arch()}): Logger initialised`
);

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    resizable: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      contextIsolation: false,
      sandbox: false,
    },
    autoHideMenuBar: true,
  });

  new Listeners(mainWindow, app, shell, dialog);

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(() => {
  createWindow();
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
  log.info(args);
});
