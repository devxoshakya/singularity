import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ipcRenderer } from 'electron';
import os from 'os';
import fs from 'fs';  
import { stringify } from 'qs';
import * as cheerio from 'cheerio';

// Define types for the custom API
type CustomAPI = {
  os: {
    networkInterfaces: () => NodeJS.Dict<os.NetworkInterfaceInfo[]>;
    platform: () => NodeJS.Platform;
    hostname: () => string;
  };
  getDocumentsPath: () => Promise<string>;
  fs: {
    readFile: typeof fs.promises.readFile;
    writeFile: typeof fs.promises.writeFile;
  };
  getFiles: (dirPath: string) => Promise<string[]>;
  openFile: (filePath: string) => Promise<string>;
  fetchStudentData: (rollNo: number) => Promise<any>;
};


const api: CustomAPI = {
  os: {
    ...os,
    networkInterfaces: () => os.networkInterfaces(),
  },
  // Function to get the "Documents/Singularity" folder path
  getDocumentsPath: () =>  ipcRenderer.invoke('get-documents-path').then((path) => path),
  fs: {
    readFile: fs.promises.readFile,
    writeFile: fs.promises.writeFile,
  },
  getFiles: async (dirPath: string) => {
    const files = await ipcRenderer.invoke('get-files', dirPath);
    return files;
  },
  openFile: async (filePath: string) => {
    const result = await ipcRenderer.invoke('open-file', filePath);
    return result;
  },
  fetchStudentData: (rollNo: number) => ipcRenderer.invoke("fetch-student-data", rollNo),


};

// Use `contextBridge` APIs to expose Electron APIs to renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error('Error exposing APIs to renderer:', error);
  }
} else {
  // Fallback if context isolation is not enabled
  (window as any).electron = electronAPI;
  (window as any).api = api;
}

// Optional: Add type declarations for window to improve type safety
declare global {
  interface Window {
    electron: typeof electronAPI;
    api: CustomAPI;
  }
}

export {};
