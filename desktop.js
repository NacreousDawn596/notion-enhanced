import { app, BrowserWindow, session } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createMainWindow = async () => {
  // Try to load unpacked extension from 'dist', fallback to 'src'
  let extensionPath = path.resolve(__dirname, 'dist');
  if (!fs.existsSync(extensionPath)) {
    extensionPath = path.resolve(__dirname, 'src');
  }

  try {
    await session.defaultSession.loadExtension(extensionPath);
    console.log('Notion Enhancer loaded natively from:', extensionPath);
  } catch (error) {
    console.error('Failed to load Notion Enhancer:', error);
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadURL('https://notion.so/');
};

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
