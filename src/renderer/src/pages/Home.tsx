import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMacAddress } from '@/hooks/Mac';
import { openDB } from 'idb';

const HomePage = () => {
  const [documentsPath, setDocumentsPath] = useState('');
  const [macAddress, setMacAddress] = useState<string | null>(null);
  const [key, setKey] = useState<string>('');
  const navigate = useNavigate();

  // Initialize IndexedDB
  const setupDB = async () => {
    const db = await openDB('activationDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
    return db;
  };

  // Check if user is already activated using IndexedDB
  useEffect(() => {
    const checkActivation = async () => {
      const db = await setupDB();
      const activationStatus = await db.get('settings', 'isActivated');
      if (activationStatus?.value === 'true') {
        navigate('/dashboard'); // Redirect to dashboard if activated
      }
    };

    checkActivation().catch((error) => {
      console.error('Error checking activation status:', error);
    });
  }, [navigate]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  // Fetch MAC Address
  useEffect(() => {
    const fetchMacAddress = async () => {
      const mac = await getMacAddress();
      setMacAddress(mac);
    };

    fetchMacAddress().catch((error) => {
      console.error('Error fetching MAC address:', error);
    });
  }, []);

  // Fetch Documents Path
  useEffect(() => {
    const fetchDocumentsPath = async () => {
      if (typeof window !== 'undefined' && (window as any).api) {
        const path = await (window as any).api.getDocumentsPath();
        setDocumentsPath(path);

        const fs = (window as any).api.fs;
        console.log('Documents path:', path);

        // Ensure the documents path exists
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
          console.log('Documents path created:', path);
        }

        const jsonPath = `${path}/.json`; // Adjusted folder name
        if (!fs.existsSync(jsonPath)) {
          fs.mkdirSync(jsonPath, { recursive: true });
          console.log('JSON path created:', jsonPath);
        }
      } else {
        console.error('window.api not available');
      }
    };

    fetchDocumentsPath().catch((error) => {
      console.error('Error fetching documents path:', error);
    });
  }, []);

  // Handle Activation Key Submission
  const activateKey = async () => {
    console.log('Activating key:', key);
    try {
      if (typeof window !== 'undefined' && (window as any).api) {
        console.log('Activating key with MAC address:', macAddress);
        const data = await (window as any).api.activation(key, macAddress);
        if (data) {
          console.log('Activation response:', data);
          if (data.message === 'Device registered successfully') {
            alert('Activation successful');
            
            // Store activation status in IndexedDB
            const db = await setupDB();
            await db.put('settings', { key: 'isActivated', value: 'true' });

            navigate('/dashboard'); // Redirect to dashboard
          } else {
            alert('Activation failed: ' + data.message);
          }
        } else {
          alert('Activation failed');
        }
      } else {
        console.error('window.api not available for activation');
      }
    } catch (error) {
      console.error('Error activating key:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <h1 className="text-5xl font-extrabold mb-4">Singularity</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        The modern Result Extraction tool for effortless results management with ease.
      </p>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Enter Activation Key"
          value={key}
          onChange={handleKeyChange}
          className="w-96 p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={activateKey}
          className="py-3 px-6 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Activate
        </button>
      </div>
      {macAddress && (
        <p className="mt-4 text-sm text-gray-500">Your MAC Address: {macAddress}</p>
      )}
    </div>
  );
};

export default HomePage;
