import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ipcRenderer } from 'electron';
import os from 'os';
import fs from 'fs';  

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
    existsSync: typeof fs.existsSync;
    mkdirSync: typeof fs.mkdirSync;
  };
  getFiles: (dirPath: string) => Promise<string[]>;
  openFile: (filePath: string) => Promise<string>;
  fetchStudentData: (rollNo: number) => Promise<any>;
  activation: (key: string, macaddress: string) => Promise<any>;
  writeToFile: (input: string) => Promise<boolean>; 
  getRecords: () => Promise<string>;
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
    existsSync: fs.existsSync,
    mkdirSync: fs.mkdirSync,
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
  activation: (key: string, macaddress: string) => ipcRenderer.invoke("activation", key, macaddress),
  writeToFile: async (input: string) => {
    const result = await ipcRenderer.invoke('write-to-file', input);
    return result;
  },
  getRecords: async () => {
    const result = await ipcRenderer.invoke('get-records');
    return result;
  },


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
