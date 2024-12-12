
import React, { useState } from 'react';

const ResultExtraction = () => {
  const [rollNumbers, setRollNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExtract = () => {
    setLoading(true);
    setProgress(0);

    // Simulate progress for result extraction
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          alert('Results extracted successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col items-center mt-12 font-sans">
      <h1 className="text-2xl font-bold mb-6">Result Extraction</h1>
      <div className="w-full max-w-md">
        <textarea
          rows={5}
          placeholder="Enter roll numbers ( one per line)"
          value={rollNumbers}
          onChange={(e) => setRollNumbers(e.target.value)}
          className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className={`mt-4 w-full py-2 px-4 text-lg font-semibold text-white rounded-lg ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-800'}`}
          onClick={handleExtract}
          disabled={loading}
        >
          Extract
        </button>
      </div>
      {loading && (
        <div className="mt-4 w-full max-w-md">
          <div className="relative pt-1">
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-green-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
            <span className="text-green-700 font-medium">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultExtraction;
