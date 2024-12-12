import { app, shell, BrowserWindow, ipcMain} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import path from 'path';
import fs  from 'fs';
import { exec } from 'child_process';
import { solver } from './src/Solver';
import { writeToFile } from './src/Helper';
import { processRollNumbers } from './src/Helper';

// Handle the request to get the "Documents/Singularity" folder path
ipcMain.handle('get-documents-path', () => {
  const documentsPath = app.getPath('documents'); // Get the Documents folder path
  return path.join(documentsPath, 'Singularity'); // Return the combined path
});

ipcMain.handle('write-to-file', (_event, input: string) => {
  try {
    writeToFile(input);
    return true;
  } catch (error) {
    console.error('Error writing to file:', error);
    return false;
  }
});

ipcMain.handle('get-records', async (_event,) => {
  try {
    await processRollNumbers();
    return 'Records processed successfully';
  } catch (error) {
    console.error('Error processing records:', error);
    return 'Error processing records';
  }
});


// Handle request to get list of files in a directory
ipcMain.handle('get-files', async (_event, dirPath: string) => {
  try {
    const files = fs.readdirSync(dirPath);
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});

ipcMain.handle('activation', async (_event, key: string, macAddress: string) => {
  if (!key || !macAddress) {
    console.error('Missing key or macAddress');
    return false; // Invalid input
  }

  try {
    const response = await fetch('https://singularity.devxoshakya.xyz/api/register', {
      method: 'POST',
      headers: {
        key:key, // Ensure the `key` is passed as string
        macaddress: macAddress, // Ensure the `macAddress` is passed as string
      },
      body: JSON.stringify({ key, macAddress }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during activation fetch:', error);
    return null; // Return null for unexpected errors
  }
});
// Handle request to open a file
ipcMain.handle('open-file', async (_event, filePath: string) => {
  try {
    let openCommand = '';

    // Detect platform and set the appropriate command
    if (process.platform === 'darwin') {
      openCommand = `open "${filePath}"`; // macOS command to open file
    } else if (process.platform === 'win32') {
      openCommand = `start "" "${filePath}"`; // Windows command to open file
    } else if (process.platform === 'linux') {
      openCommand = `xdg-open "${filePath}"`; // Linux command to open file
    }
    



    // Execute the open command
    exec(openCommand, (error, stdout) => {
      if (error) {
        console.error(`Error opening file: ${error}`);
      } else {
        console.log(`File opened: ${stdout}`);
      }
    });

    return 'File opened successfully';
  } catch (error) {
    console.error('Error opening file:', error);
    return 'Error opening file';
  }
});


function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {


  ipcMain.handle("fetch-student-data", async (event, rollNo: number) => {
    try {
      const data = await solver(rollNo);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  });



  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
