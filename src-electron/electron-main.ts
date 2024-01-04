import dayjs from 'dayjs';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import Listeners from './ipcListeners';
const path = require('path');
const os = require('os');
const fs = require('fs');

// Optional, initialize the logger for any renderer process
log.initialize();
const currDate = dayjs().format('DD-MM-YYYY');

const logFolder = path.join(
  process.platform === 'win32' ? app.getPath('appData') : os.homedir(),
  'Drehmal Installer',
  'logs'
);

const getLogFileName: () => string = () => {
  let index = 1;
  let name = `${currDate}_${index}-installer.log`;
  while (true) {
    if (!fs.existsSync(path.join(logFolder, name))) break;
    else name = `${currDate}_${index++}-installer.log`;
  }
  return name;
};
// can't use function call in resolve path as it'll create a new file for each logger instance
const logFileName = getLogFileName();
log.transports.file.resolvePathFn = () => path.join(logFolder, logFileName);
log.transports.file.format = '[{h}:{i}:{s}.{ms}] [{level}] {text}';

log.info('Logger initialised');

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

  new Listeners(mainWindow, app, shell);

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
