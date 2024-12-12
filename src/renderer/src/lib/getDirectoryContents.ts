import fs from 'fs/promises';
import path from 'path';

export async function getDirectoryContents(directoryPath: string) {
  try {
    const files = await fs.readdir(directoryPath);
    return files.map(file => ({
      name: file,
      isDirectory: fs.stat(path.join(directoryPath, file)).then(stat => stat.isDirectory())
    }));
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}
