
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMacAddress } from '@/hooks/Mac';
import { openDB } from 'idb';

const HomePage = () => {
  const [documentsPath, setDocumentsPath] = useState('');
  const [macAddress, setMacAddress] = useState<string | null>(null);
  const [key, setKey] = useState<string>('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

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

  useEffect(() => {
    const checkActivation = async () => {
      const db = await setupDB();
      const activationStatus = await db.get('settings', 'isActivated');
      if (activationStatus?.value === 'true') {
        navigate('/dashboard');
      }
    };

    checkActivation().catch((error) => {
      console.error('Error checking activation status:', error);
    });
  }, [navigate]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  useEffect(() => {
    const fetchMacAddress = async () => {
      const mac = await getMacAddress();
      setMacAddress(mac);
    };

    fetchMacAddress().catch((error) => {
      console.error('Error fetching MAC address:', error);
    });
  }, []);

  useEffect(() => {
    const fetchDocumentsPath = async () => {
      if (typeof window !== 'undefined' && (window as any).api) {
        const path = await (window as any).api.getDocumentsPath();
        setDocumentsPath(path);

        const fs = (window as any).api.fs;
        console.log('Documents path:', path);

        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
          console.log('Documents path created:', path);
        }

        const jsonPath = `${path}/.json`;
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

  const activateKey = async () => {
    setLoading(true); // Set loading to true
    try {
      if (typeof window !== 'undefined' && (window as any).api) {
        console.log('Activating key with MAC address:', macAddress);
        const data = await (window as any).api.activation(key, macAddress);
        if (data) {
          console.log('Activation response:', data);
          if (data.message === 'Device registered successfully') {
            alert('Activation successful');
            const db = await setupDB();
            await db.put('settings', { key: 'isActivated', value: 'true' });
            navigate('/dashboard');
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
    } finally {
      setLoading(false); // Reset loading to false
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
          disabled={loading} // Disable input while loading
        />
        <button
          onClick={activateKey}
          disabled={loading} // Disable button while loading
          className={`py-3 px-6 text-lg font-semibold text-white rounded-lg ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {loading ? 'Activating...' : 'Activate'}
        </button>
      </div>
      {macAddress && (
        <p className="mt-4 text-sm text-gray-500">Your MAC Address: {macAddress}</p>
      )}
    </div>
  );
};

export default HomePage;
