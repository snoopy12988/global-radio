const { app, BrowserWindow, Menu, globalShortcut, ipcMain, net } = require('electron');
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

// 主进程代理 API 请求（绕过渲染进程网络限制）
ipcMain.handle('net-fetch', (event, url) => {
  return new Promise((resolve, reject) => {
    const request = net.request({
      url,
      method: 'GET',
      session: require('electron').session.defaultSession
    });
    let body = '';
    const timeout = setTimeout(() => {
      request.abort();
      reject(new Error('timeout'));
    }, 10000);
    request.on('response', (response) => {
      if (response.statusCode !== 200) {
        clearTimeout(timeout);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.on('data', (chunk) => { body += chunk.toString(); });
      response.on('end', () => {
        clearTimeout(timeout);
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('JSON parse error')); }
      });
      response.on('error', (e) => { clearTimeout(timeout); reject(e); });
    });
    request.on('error', (e) => { clearTimeout(timeout); reject(e); });
    request.end();
  });
});

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
