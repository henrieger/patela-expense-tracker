const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getTransactions: () => ipcRenderer.invoke('get-transactions'),
  addTransaction: (transaction) => ipcRenderer.invoke('add-transaction', transaction),
  updateTransaction: (transaction) => ipcRenderer.invoke('update-transaction', transaction),
  deleteTransaction: (id) => ipcRenderer.invoke('delete-transaction', id),
  getCategoriesSummary: () => ipcRenderer.invoke('get-categories-summary'),
  getTotals: () => ipcRenderer.invoke('get-totals')
});