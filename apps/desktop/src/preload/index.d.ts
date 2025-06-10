import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
  interface ElectronAPI {
    process: any;
    fetchStudentData: (rollNo: number) => Promise<any>;
  }

}
