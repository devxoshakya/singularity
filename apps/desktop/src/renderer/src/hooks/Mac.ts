
export function getMacAddress(): string | null {
  const interfaces = (window as any).api.os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const net of iface) {
        if (!net.internal && net.mac !== '00:00:00:00:00:00') {
          return net.mac;
        }
      }
    }
  }
  return null; // No valid MAC address found
}


export function writeFile(fileName: string, content: string): void {
  const fs = (window as any).api.fs;
  fs.writeFile(fileName, content)
    .then(() => console.log('File written successfully'))
    .catch((error: Error) => console.error('Error writing file:', error));
}

export function readFile(fileName: string): void {
  const fs = (window as any).api.fs;
  fs.readFile(fileName, 'utf8')
    .then((data: string) => console.log('File content:', data))
    .catch((error: Error) => console.error('Error reading file:', error));
}