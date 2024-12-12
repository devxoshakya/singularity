
import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [apiKey, setApiKey] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  // Function to fetch IP address
  const fetchIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unavailable';
    }
  };

  // Function to generate a unique API key based on IP address
  const generateApiKeyFromIp = (ip) => {
    // Create a hash-like API key based on IP
    return `api_${btoa(ip).replace(/=/g, '').substring(0, 16)}`;
  };

  // On component mount, fetch IP and generate the key
  useEffect(() => {
    const initializeApiKey = async () => {
      const userIp = await fetchIpAddress();
      setIpAddress(userIp);
      const key = generateApiKeyFromIp(userIp);
      setApiKey(key);
    };
    initializeApiKey();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <h1 className="text-5xl font-extrabold mb-4">Singularity</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        The modern Result Extraction tool for effortless results management with ease.
      </p>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={apiKey}
          readOnly
          placeholder="API Key will appear here"
          className="w-96 p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => alert('API key already generated for this IP address!')}
          className="py-3 px-6 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Activate
        </button>
      </div>
      {ipAddress && (
        <p className="mt-4 text-sm text-gray-500">Your IP Address: {ipAddress}</p>
      )}
    </div>
  );
};

export default HomePage;