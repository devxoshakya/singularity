// import { useState } from 'react';

// const ResultExtraction = () => {
//   const [rollNumbers, setRollNumbers] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleExtract = async () => {
//     setLoading(true);
//     setProgress(0);
    
//     // Format roll numbers: only keep digits and filter out invalid ones
//     const rollNoArray = rollNumbers
//     .split('\n')
//     .map((rollNo) => rollNo.trim())
//     .filter((rollNo) => /^[0-9]{13}$/.test(rollNo)); // 13 digits only
    
//     // Write formatted roll numbers to a file
//     try {
//       // Use the provided API to write data to the file
//       await (window as any).api.writeToFile(rollNoArray.join('\n'));
//       alert('Result Extraction started');
//       await (window as any).api.getRecords();

//       // Alert that extraction has started

//       // Get the initial count of roll numbers
//       const initialCount = rollNoArray.length;

//       // Simulate reading and processing roll numbers
//       const interval = setInterval(async () => {
//         try {
//           const path = await (window as any).api.getDocumentsPath();
//           console.log('Documents path:', path);
//           const fs = (window as any).api.fs;
//           const fileContent = await fs.readFile(`${path}/.json/roll.txt`);
//           const content = fileContent?.toString() || '' // Adjust file path accordingly
//           const remainingRollNumbers = content.split('\n').length - 1;

//           const currentCount = initialCount - remainingRollNumbers;

//           // Update progress
//           const progressPercentage = (currentCount / initialCount) * 100;
//           setProgress(progressPercentage);

//           // If all roll numbers are processed, stop the interval
//           if (remainingRollNumbers === 0) {
//             clearInterval(interval);
//             setLoading(false);
//             alert('Result Extraction Success');
//           }
//         } catch (error) {
//           console.error('Error reading file:', error);
//         }
//       }, 300); // Check every 300ms

//     } catch (error) {
//       setLoading(false);
//       console.error('Error writing to file:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-12 font-sans">
//       <h1 className="text-2xl font-bold mb-6">Result Extraction</h1>
//       <div className="w-full max-w-md">
//         <textarea
//           rows={5}
//           placeholder="Enter roll numbers (one per line)"
//           value={rollNumbers}
//           onChange={(e) => setRollNumbers(e.target.value)}
//           className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleExtract}  // Trigger the extraction and writing to file
//           disabled={loading}
//           className={`mt-4 w-full py-2 px-4 text-lg font-semibold text-white rounded-lg ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-800'}`}
//         >
//           Extract
//         </button>
//       </div>
//       {loading && (
//         <div className="mt-4 w-full max-w-md">
//           <div className="relative pt-1">
//             <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-green-200">
//               <div
//                 style={{ width: `${progress}%` }}
//                 className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
//               ></div>
//             </div>
//             <span className="text-green-700 font-medium">{progress}%</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResultExtraction;
import { useState } from 'react';

const ResultExtraction = () => {
  const [rollNumbers, setRollNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExtract = async () => {
    setLoading(true);
    setProgress(0);

    const rollNoArray = rollNumbers
      .split('\n')
      .map((rollNo) => rollNo.trim())
      .filter((rollNo) => /^[0-9]{13}$/.test(rollNo)); // 13 digits only

    try {
      await (window as any).api.writeToFile(rollNoArray.join('\n'));
      alert('Result Extraction started');
      await (window as any).api.getRecords();

      const initialCount = rollNoArray.length;

      const interval = setInterval(async () => {
        try {
          const path = await (window as any).api.getDocumentsPath();
          const fs = (window as any).api.fs;
          const fileContent = await fs.readFile(`${path}/.json/roll.txt`);
          const content = fileContent?.toString() || '';
          const remainingRollNumbers = content.split('\n').length - 1;

          const currentCount = initialCount - remainingRollNumbers;
          const progressPercentage = (currentCount / initialCount) * 100;
          setProgress(progressPercentage);

          if (remainingRollNumbers === 0) {
            clearInterval(interval);
            setLoading(false);
            alert('Result Extraction Success');
          }
        } catch (error) {
          console.error('Error reading file:', error);
          clearInterval(interval);
          setLoading(false);
        }
      }, 300);
    } catch (error) {
      setLoading(false);
      console.error('Error writing to file:', error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 font-sans">
      <h1 className="text-2xl font-bold mb-6">Result Extraction</h1>
      <div className="w-full max-w-md">
        <textarea
          rows={5}
          placeholder="Enter roll numbers (one per line)"
          value={rollNumbers}
          onChange={(e) => setRollNumbers(e.target.value)}
          className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleExtract}
          disabled={loading}
          className={`mt-4 w-full py-2 px-4 text-lg font-semibold text-white rounded-lg ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-800'
          }`}
        >
          {loading ? 'Processing...' : 'Extract'}
        </button>
      </div>
      {loading && (
        <div className="mt-4 w-full max-w-md">
          
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            <span className="ml-2 text-lg text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultExtraction;
