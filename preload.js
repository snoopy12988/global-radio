const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  // 通过主进程发起网络请求，绕过渲染进程的网络限制
  netFetch: (url) => ipcRenderer.invoke('net-fetch', url)
});
