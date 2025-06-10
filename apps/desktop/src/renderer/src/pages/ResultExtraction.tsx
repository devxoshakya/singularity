import { useState, useRef, useEffect } from "react";

const ResultExtraction = () => {
  const [rollNumbers, setRollNumbers] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remainingRollNumbers, setRemainingRollNumbers] = useState(0);
  const [totalRollNumbers, setTotalRollNumbers] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleExtract = async () => {
    setLoading(true);
    setProgress(0);
    setStartTime(Date.now());

    const rollNoArray = rollNumbers
      .split("\n")
      .map((rollNo) => rollNo.trim())
      .filter((rollNo) => /^[0-9]{13}$/.test(rollNo));

    const total = rollNoArray.length;
    setTotalRollNumbers(total);
    setRemainingRollNumbers(total);

    try {
      await (window as any).api.writeToFile(rollNoArray.join("\n"));
      await (window as any).api.getRecords();
    } catch (error) {
      setLoading(false);
      console.error("Error starting extraction:", error);
    }
  };

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(async () => {
      try {
        const remaining = await (window as any).api.getRollNumberCount();
        setRemainingRollNumbers(remaining);

        const progressPercentage =
          ((totalRollNumbers - remaining) / totalRollNumbers) * 100;
        setProgress(progressPercentage);

        if (remaining === 0) {
          clearInterval(interval);
          setLoading(false);

          if (startTime) {
            const endTime = Date.now();
            const timeTaken = ((endTime - startTime) / 1000);
            alert(
              `Result Extraction Success!\nTime Taken: ${timeTaken} seconds`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching roll number count:", error);
        clearInterval(interval);
        setLoading(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, totalRollNumbers, startTime]);

  const handleInputClick = () => {
    setExpanded(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleInputBlur = () => {
    if (rollNumbers.trim() === "") {
      setExpanded(false);
    }
  };

  const displayValue = expanded
    ? rollNumbers
    : rollNumbers.split("\n")[0] +
      (rollNumbers.split("\n").length > 1 ? "..." : "");

  return (
    <div className="flex flex-col items-center mt-12 font-sans">
      <h1 className="text-2xl font-bold mb-6">Result Extraction</h1>
      <div className="w-full max-w-md">
        <div className="relative w-full" onClick={handleInputClick}>
          {expanded ? (
            <textarea
              ref={textareaRef}
              rows={6}
              placeholder="Enter roll numbers (one per line)"
              value={rollNumbers}
              onChange={(e) => setRollNumbers(e.target.value)}
              onBlur={handleInputBlur}
              className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          ) : (
            <input
              type="text"
              placeholder="Enter roll numbers"
              value={displayValue}
              readOnly
              className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white cursor-text"
            />
          )}
        </div>
        <button
          onClick={handleExtract}
          disabled={loading}
          className={`mt-4 w-full py-2 px-4 text-lg font-semibold text-white rounded-lg ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          {loading ? "Processing..." : "Extract"}
        </button>
      </div>
      {loading && (
        <div className="mt-4 w-full max-w-md">
          <div className="relative h-4 bg-gray-200 rounded">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-sm transition-width"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-800">
              {`${remainingRollNumbers}/${totalRollNumbers}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultExtraction;


// 358 - 791 seconds { avg time 2.2094 / roll no}
// 964 - 2152 seconds { avg time 2.2323 / roll no}
// 60 - 126.003 seconds { avg time 2.10005 / roll no}