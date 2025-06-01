import { useState, useEffect } from "react";

function App() {
    const [studentData, setStudentData] = useState<any[]>([]); // Store the valid student data
    const [loading, setLoading] = useState<boolean>(false); // Track loading state
    const [progress, setProgress] = useState<number>(0); // Track progress

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true before starting the fetch

            const rollNos = [
                2300680100104, 2300680100105, 2300680100106, 2300680100107, 2300680100108,
                2300680100109, 2300680100110, 2300680100111, 2300680100112, 2300680100113,
                2300680100114, 2300680100115, 2300680100116, 2300680100117, 2300680100118,
                2300680100119, 2300680100120, 2300680100121, 2300680100122, 2300680100123,
                2300680100124, 2300680100125, 2300680100126, 2300680100127, 2300680100128,
                2300680100129, 2300680100130, 2300680100131, 2300680100132, 2300680100133,
                2300680100134, 2300680100135, 2300680100136, 2300680100137, 2300680100138,
                2300680100139, 2300680100140, 2300680100141, 2300680100142, 2300680100143,
                2300680100144, 2300680100145, 2300680100146, 2300680100147, 2300680100148,
                2300680100149, 2300680100150, 2300680100151, 2300680100152, 2300680100153,
                2300680100154, 2300680100155, 2300680100156, 2300680100157, 2300680100158,
                2300680100159, 2300680100160, 2300680100161, 2300680100162, 2300680100163,
                2300680100164, 2300680100165, 2300680100166, 2300680100167, 2300680100168,
                2300680100169, 2300680100170, 2300680100171, 2300680100172, 2300680100173,
                2300680100174, 2300680100175, 2300680100176,
            ];

            const processedData: any[] = []; // Store the valid data
            let remainingRollNos = [...rollNos]; // Copy the array to track remaining roll numbers

            for (let rollNo of remainingRollNos) {
                try {
                    const data = await (window as any).api.fetchStudentData(rollNo);
                    if (data) {
                        processedData.push(data);
                        console.log(data); // Push valid data to the array
                    }
                } catch (error) {
                    console.error(`Error fetching data for rollNo ${rollNo}:`, error);
                } finally {
                    remainingRollNos = remainingRollNos.filter((num) => num !== rollNo); // Remove processed rollNo
                    setProgress(((rollNos.length - remainingRollNos.length) / rollNos.length) * 100); // Update progress
                    if (remainingRollNos.length === 0) {
                        console.log("All roll numbers processed.");
                    }
                }
            }

            setStudentData(processedData); // Update the state with the processed data
            setLoading(false); // Set loading to false after processing
        };

        fetchData(); // Call the fetchData function inside useEffect
    }, []); // Empty dependency array to run only on component mount

    return (
        <div>
            {loading ? (
                <div>
                    <p>Loading...</p> // Display loading text while fetching data
                    <progress value={progress} max="100">{progress}%</progress> // Display progress bar
                </div>
            ) : (
                <pre>{JSON.stringify(studentData, null, 2)}</pre> // Display student data
            )}
        </div>
    );
}

export default App;
