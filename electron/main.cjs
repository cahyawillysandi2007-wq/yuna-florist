const { app, BrowserWindow, shell } = require('electron');

app.setName('Yuna Florist Admin');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    title: 'Yuna Florist Admin',
    autoHideMenuBar: true,
    show: false,
    focusable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      partition: 'persist:yunaflorist'
    }
  });

  const isDev = !app.isPackaged;
  win.loadURL(isDev ? 'http://localhost:3000/admin/login' : 'https://yuna-florist.vercel.app/admin/login');

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
    win.webContents.focus();
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.focus();
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});