import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { solver } from './Solver';  // Assuming solver is an async function you have defined elsewhere
import { writeDataToTemplate } from './Excel';


let index = 1;

// Function to write input data to roll.txt file
export function writeToFile(input: string): void {
    console.log('Writing to file:', input);
    const documentsPath = app.getPath('documents'); // Get the Documents folder path
    const real = path.join(documentsPath, 'Singularity/.json'); 

    const filePath = path.join(real, 'roll.txt');
    console.log('File path:', filePath);
    
    // Write the input string to the file, erasing any existing data
    fs.writeFileSync(filePath, input, 'utf8');
    console.log('Write complete');
}

// Function to process roll numbers from roll.txt file one by one
export async function processRollNumbers(): Promise<void> {
    const documentsPath = app.getPath('documents');
    const real = path.join(documentsPath, 'Singularity/.json');
    const filePath = path.join(real, 'roll.txt');
    const jsonFilePathBase = path.join(real, 'record');
    const jsonFilePath = getNextJsonFilePath(jsonFilePathBase);

    try {
        // Check if the roll.txt file exists
        if (!fs.existsSync(filePath)) {
            console.log('roll.txt file not found');
            return;
        }

        // Read the roll numbers from roll.txt file
        let fileContent = fs.readFileSync(filePath, 'utf8');
        const rollNumbers = fileContent.split('\n').map((rollNo) => rollNo.trim()).filter(Boolean);

        // Initialize the results array (if the file doesn't exist, we create an empty array)
        let results: any[] = [];
        if (fs.existsSync(jsonFilePath)) {
            // Read existing results if the file exists
            const existingData = fs.readFileSync(jsonFilePath, 'utf8');
            results = JSON.parse(existingData);
        }

        // Start processing each roll number
        for (const rollNo of rollNumbers) {
            console.log(`Processing roll number: ${rollNo}`);

            // Call the solver with the current roll number
            const response = await solver(Number(rollNo));

            // Append the response to the results array (without the roll number)
            results.push(response);

            // Save the updated results array to the same JSON file
            fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2), 'utf8');
            console.log(`Saved result for roll number: ${rollNo} to ${jsonFilePath}`);

            // Remove the processed roll number from roll.txt
            fileContent = fileContent.replace(rollNo + '\n', '');
            
            fs.writeFileSync(filePath, fileContent, 'utf8');
            console.log(`Removed roll number: ${rollNo} from roll.txt`);

            // Optional: Pause for a brief moment before continuing
            // await new Promise((resolve) => setTimeout(resolve, 500));
        }

        console.log('All roll numbers processed.');
        
        fs.writeFileSync(filePath, '', 'utf8');
        console.log('Cleared roll.txt file');
        writeDataToTemplate(jsonFilePath, real + "/template.xlsx", documentsPath +"/Singularity" + `/record${index}.xlsx`, 7, 1).catch(
            (err) => console.error("Error:", err)
          );
    
    } catch (error) {
        console.error('Error processing roll numbers:', error);
    }
}

// Function to get the number of roll numbers in the roll.txt file
export function getRollNumberCount(): number {
    const documentsPath = app.getPath('documents');
    const real = path.join(documentsPath, 'Singularity/.json');
    const filePath = path.join(real, 'roll.txt');

    try {
        // Check if the roll.txt file exists
        if (!fs.existsSync(filePath)) {
            console.log('roll.txt file not found');
            return 0;
        }

        // Read the roll numbers from roll.txt file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const rollNumbers = fileContent.split('\n').map((rollNo) => rollNo.trim()).filter(Boolean);

        // Return the count of roll numbers
        console.log(`Number of roll numbers in file: ${rollNumbers.length}`);
        return rollNumbers.length;
        
    } catch (error) {
        console.error('Error reading roll numbers:', error);
        return 0;
    }
}


// Function to get the next available JSON file path (record1.json, record2.json, etc.)
function getNextJsonFilePath( baseFilePath: string): string {
    let filePath = path.join(`${baseFilePath}${index}.json`);
    
    // Check if file exists, if so, increment the index
    while (fs.existsSync(filePath)) {
        index++;
        filePath = path.join(`${baseFilePath}${index}.json`);
    }

    return filePath;
}

