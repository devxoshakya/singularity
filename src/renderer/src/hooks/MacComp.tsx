import React from 'react';
import { getMacAddress, writeFile } from './Mac';
import FileExplorer from './FileOpen';
import App from './Students';
const MAC = () => {
  const [macAddress, setMacAddress] = React.useState<string | null>(null);
  const [documentsPath, setDocumentsPath] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>('');
  const [fileContent, setFileContent] = React.useState<string>('');

  React.useEffect(() => {
    const mac = getMacAddress();
    setMacAddress(mac);
  }, []);

  React.useEffect(() => {
    const fetchDocumentsPath = async () => {
      const path = await (window as any).api.getDocumentsPath();
      setDocumentsPath(path);
    };

    fetchDocumentsPath();
  }, []);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleFileContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
  };

  const handleWriteFile = async () => {
    if (fileName && fileContent && documentsPath) {
      const filePath = `${documentsPath}/${fileName}`;
      await writeFile(filePath, fileContent);
      alert('File written successfully');
    } else {
      alert('Please provide a file name and content');
    }
  };

  return (
    <div>
      <h1>Your MAC Address</h1>
      <p>{macAddress || 'Unable to fetch MAC address'}</p>
      <h1>Your Documents Path</h1>
      <p>{documentsPath || 'Unable to fetch documents path'}</p>
      <div className='text-black '>
        <input
          type="text"
          placeholder="File Name"
          value={fileName}
          onChange={handleFileNameChange}
        />
        <textarea
          placeholder="File Content"
          value={fileContent}
          onChange={handleFileContentChange}
        />
        <button className='bg-slate-400' onClick={handleWriteFile}>Write File</button>
      </div>
      <FileExplorer />
      <App />
    </div>
  );
};

export default MAC;
