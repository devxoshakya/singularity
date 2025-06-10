import { useState, useEffect } from 'react';

const FileExplorer =  () => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      // Replace this with the actual directory you want to fetch
      const directoryPath = await (window as any).api.getDocumentsPath();
      const fileList = await (window as any).api.getFiles(directoryPath);
      console.log(fileList);
      setFiles(fileList);
    };

    fetchFiles();
  }, []);

  const openFile = async (fileName: string) => {
    if (fileName) {
      const directoryPath = await (window as any).api.getDocumentsPath();
      const filePath = `${directoryPath}/${fileName}`; // Construct full file path
      const result = await (window as any).api.openFile(filePath);
      alert(result); 
    }
  };



  return (
    <div>
      <h1>File Explorer</h1>
      <ul>
        {files.map((file, index) => (
          <li key={index} onClick={() => openFile(file)}>
            {file}
          </li>
        ))}
      </ul>
      {selectedFile && <div>Opening: {selectedFile}</div>}
    </div>
  );
};

export default FileExplorer;
