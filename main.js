const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');

// Initialize database
const db = new Database();

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Debug: Log the icon path
  console.log('Icon path:', path.join(__dirname, 'assets', 'icon.png'));

  // Load the app
  mainWindow.loadFile('index.html');

  // Open DevTools for debugging - remove this later in production
  //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('get-transactions', async () => {
  try {
    return db.getAllTransactions();
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
});

ipcMain.handle('add-transaction', async (event, transaction) => {
  try {
    return db.addTransaction(transaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
});

ipcMain.handle('delete-transaction', async (event, id) => {
  try {
    return db.deleteTransaction(id);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
});

ipcMain.handle('get-categories-summary', async () => {
  try {
    return db.getCategoriesSummary();
  } catch (error) {
    console.error('Error getting categories summary:', error);
    return {};
  }
});

ipcMain.handle('get-totals', async () => {
  try {
    return db.getTotals();
  } catch (error) {
    console.error('Error getting totals:', error);
    return { totalIncome: 0, totalExpenses: 0, balance: 0 };
  }
});