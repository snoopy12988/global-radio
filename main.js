const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createMenu() {
  // 隐藏菜单栏，快捷键仍生效
  Menu.setApplicationMenu(null);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    title: '全球电台',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#2b1e3e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // 注入 CORS 头，解决国内 CDN 跨域拦截
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*'],
        'Access-Control-Allow-Methods': ['GET, OPTIONS']
      }
    });
  });

  mainWindow.webContents.on('did-fail-load', (event, code, desc) => {
    console.error('页面加载失败:', code, desc);
  });

  // Ctrl+Shift+I 打开开发者工具（排查网络错误用）
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key === 'I') {
      mainWindow.webContents.toggleDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createMenu();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
