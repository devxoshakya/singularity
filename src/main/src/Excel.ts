import ExcelJS from "exceljs";
import fs from "fs";

interface Subject {
  subject: string;
  internal: number;
  external: number;
}

interface StudentResult {
  rollNo: string;
  fullName: string;
  Subjects: Subject[];
  totalMarksObtained: number;
  SGPA: Record<string, number>;
  latestResultStatus: string;
  CarryOvers: any;
  latestCOP: string;
}

// Utility Functions
function getLatestCop(carryOvers: any) {
  if (!carryOvers || carryOvers.length === 0 ||
    (carryOvers.length === 1 && carryOvers[0][0] === "No Backlogs")) {
    return "COP: "; // No backlogs
  }

  carryOvers.sort((a: any, b: any) => b.session.localeCompare(a.session));
  return carryOvers[0].cop.replace("COP :", "").trim();
}

function processCarryOver(input: string) {
  const subjectCodes = input.replace("COP :", "").trim().split(",").filter(code => code.trim() !== "");

  if (subjectCodes.length === 0) {
    return [0, 0, ""]; // No carryovers
  }

  let oddSemCarryOvers = 0;
  let evenSemCarryOvers = 0;

  subjectCodes.forEach((code) => {
    const trimmedCode = code.trim();
    const firstDigit = parseInt(trimmedCode.match(/\d/)?.[0] ?? "0", 10);
    const secondDigit = parseInt(trimmedCode.match(/\d{2}/)?.[0][1] ?? "0", 10);

    if (firstDigit === 0) {
      if (secondDigit === 9) {
        evenSemCarryOvers++; // Exception for 8th semester
      } else if (secondDigit % 2 === 0) {
        evenSemCarryOvers++;
      } else {
        oddSemCarryOvers++;
      }
    } else {
      if (firstDigit % 2 === 0) {
        evenSemCarryOvers++;
      } else {
        oddSemCarryOvers++;
      }
    }
  });

  return [
    oddSemCarryOvers,
    evenSemCarryOvers,
    subjectCodes.join(",")
  ];
}

function latestSGPA(SGPA: Record<string, number>) {
  const latestSemesterKey = Object.keys(SGPA)
    .sort((a, b) => parseInt(b.replace("sem", "")) - parseInt(a.replace("sem", "")))[0];
  return SGPA[latestSemesterKey];
}

// Main Function to Write Data
export const writeDataToTemplate = async (
  jsonFilePath: string,
  templateFilePath: string,
  outputFilePath: string,
  startRow: number,
  startColumn: number
) => {
  const jsonDataArray: StudentResult[] = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
  jsonDataArray.sort((a, b) => a.rollNo.localeCompare(b.rollNo));



  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templateFilePath);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error("Worksheet not found");
  }

  // Replace placeholders with specific values
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      if (jsonDataArray.length > 0) {
        const jsonData = jsonDataArray[0];
        jsonData.Subjects.forEach((subject, subIndex) => {
          if (cell.value && typeof cell.value === "string" && cell.value.includes(`Subject-${subIndex}`)) {
            cell.value = cell.value.replace(`Subject-${subIndex}`, subject.subject);
          }
        });
      }



    });
  });


  const maxSubjects = 10;
  const boxStartRow = 7;
  const dataRows = jsonDataArray.length;
  worksheet.spliceRows(boxStartRow, 0, ...Array(dataRows).fill(null));

  var currentRow = boxStartRow;
  let serialNo = 1;

  jsonDataArray.forEach((jsonData) => {
    worksheet.getCell(currentRow, startColumn).value = serialNo++;
    worksheet.getCell(currentRow, startColumn + 1).value = jsonData.rollNo;
    worksheet.getCell(currentRow, startColumn + 2).value = jsonData.fullName;

    jsonData.Subjects.forEach((subject, subIndex) => {
      if (subIndex < maxSubjects) {
        const subjectColumn = startColumn + 5 + subIndex * 2;
        worksheet.getCell(currentRow, subjectColumn).value = ((String(subject.internal) == "ABS" || String(subject.internal) == "--" ? "###": Number(subject.internal)));
        worksheet.getCell(currentRow, subjectColumn + 1).value = ((String(subject.external) == "ABS"? "###" : (String(subject.external) == "--" ? 0 : Number(subject.external))))
      }
    });

    const totalMarksColumn = startColumn + maxSubjects * 2 + 5;
    const sgpaColumn = startColumn + maxSubjects * 2 + 6;
    const resultStatusColumn = startColumn + maxSubjects * 2 + 7;
    const carryOverColumn = startColumn + maxSubjects * 2 + 8;

    worksheet.getCell(currentRow, resultStatusColumn).value = jsonData.latestResultStatus;

    const [oddSemCarryOvers, evenSemCarryOvers, carryOverSubjects] = processCarryOver(
      jsonData.latestCOP
    );

    worksheet.getCell(currentRow, carryOverColumn).value = oddSemCarryOvers;
    worksheet.getCell(currentRow, carryOverColumn + 1).value = evenSemCarryOvers;
    worksheet.getCell(currentRow, carryOverColumn + 2).value = carryOverSubjects;

    worksheet.getCell(currentRow, totalMarksColumn).value = jsonData.totalMarksObtained ;
    worksheet.getCell(currentRow, sgpaColumn).value = latestSGPA(jsonData.SGPA);

    currentRow++;
  });

  // filling the boxy thingy
  const newBoxStartRow = ++currentRow + 1;
  const TotalStudents = jsonDataArray.length;
  const TotalStudentsColumn = startColumn + 5;
  // Insert the TotalStudents value into the specified range
  for (let col = TotalStudentsColumn; col < TotalStudentsColumn + maxSubjects * 2; col++) {
    worksheet.getCell(newBoxStartRow + 3, col).value = TotalStudents;
  }

  // Define the range for the COUNTIF formula
  const endColumn = 10; // Last column to apply the formula
  const targetRow = newBoxStartRow + 4; // Row where the formula will be applied
  const dataStartRow = 7; // Starting row of the data range
  const dataEndRow = jsonDataArray.length + 6; // Ending row of the data range
  const searchString = "###"; // String to search for

  // Loop over the columns and set the COUNTIF formula
  for (let col = TotalStudentsColumn; col < TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(targetRow, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `COUNTIF(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "${searchString}")` };
  }

  // result available 
  for(let col = TotalStudentsColumn; col <= TotalStudentsColumn + maxSubjects * 2; col++) {
    worksheet.getCell(newBoxStartRow + 7, col).value = TotalStudents;
  }
  // higest marks
  for (let col = TotalStudentsColumn; col <= 1 + TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(newBoxStartRow+8, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `MAX(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow})` };
  }

  //average marks
  for (let col = TotalStudentsColumn; col <= 1 + TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(newBoxStartRow+9, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `AVERAGE(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow})` };
  }

  // students with <30% marks =COUNTIF(F7:F68,"<15") 
  for (let col = TotalStudentsColumn; col < TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(newBoxStartRow+10, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `COUNTIF(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}), "<15"` };
  }
  
  // studnets with Students with 30-50% Marks =COUNTIFS(F7:F68,">=15",F7:F68,"<25")
  for (let col = TotalStudentsColumn; col < TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(newBoxStartRow+11, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=15", ${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<25")` };
  }

  // Students with 50-60% Marks =COUNTIFS(F7:F68,">=25",F7:F68,"<30")
  for (let col = TotalStudentsColumn; col < TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(newBoxStartRow+12, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=25", ${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<30")` };
  }

  // Students with 60-70% Marks =COUNTIFS(F7:F68,">=30",F7:F68,"<37.5")
  for (let col = TotalStudentsColumn; col < TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(newBoxStartRow+13, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=30", ${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<37.5")` };
  }

 // Students with >=75% Marks =COUNTIF(F7:F68,">=37.5")
  for (let col = TotalStudentsColumn; col < TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(newBoxStartRow+14, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `COUNTIF(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=37.5")` };
  }

  // pass percent =(F81-F84)*100/F81
  for (let col = TotalStudentsColumn; col < TotalStudentsColumn + maxSubjects * 2; col++) {
    const cell = worksheet.getCell(newBoxStartRow+20, col);
    const columnLetter = worksheet.getColumn(col).letter;
     // Get the column letter
    cell.value = { formula: `(${columnLetter}${newBoxStartRow+7}-${columnLetter}${newBoxStartRow+10})*100/${columnLetter}${newBoxStartRow+7}` };
  }

  // total marks ka formula
  {
    const cell = worksheet.getCell(newBoxStartRow+10, TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(TotalStudentsColumn + maxSubjects * 2).letter;
    cell.value = { formula: `COUNTIF(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<255")` };
  }

  {
    const cell = worksheet.getCell(newBoxStartRow+11, TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(TotalStudentsColumn + maxSubjects * 2).letter;
    // =COUNTIFS(N7:N68,">=255",N7:N68,"<425")
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=255", ${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<425")` };
  }

  {
    const cell = worksheet.getCell(newBoxStartRow+12, TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(TotalStudentsColumn + maxSubjects * 2).letter;
    // =COUNTIFS(N7:N68,">=425",N7:N68,"<510")
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=425", ${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<510")` };

  }

  {
    const cell = worksheet.getCell(newBoxStartRow+13, TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(TotalStudentsColumn + maxSubjects * 2).letter;
    // =COUNTIFS(N7:N68,">=510",N7:N68,"<637.5")
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=510", ${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<637.5")` };
  }

  {
    const cell = worksheet.getCell(newBoxStartRow+14, TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(TotalStudentsColumn + maxSubjects * 2).letter;
    // =COUNTIF(N7:N68,">637.5")
    cell.value = { formula: `COUNTIF(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=637.5")` };
  }

  // cop wale bacche
  worksheet.getCell(newBoxStartRow+15, TotalStudentsColumn + maxSubjects * 2).value = {
    formula: `COUNTIF(${worksheet.getColumn(2 + TotalStudentsColumn + maxSubjects * 2).letter}${dataStartRow}:${worksheet.getColumn(2 + TotalStudentsColumn + maxSubjects * 2).letter}${dataEndRow}, "PASS")`
  }

  // pwg status 
  worksheet.getCell(newBoxStartRow+16, TotalStudentsColumn + maxSubjects * 2).value = {
    formula: `COUNTIF(${worksheet.getColumn(2 + TotalStudentsColumn + maxSubjects * 2).letter}${dataStartRow}:${worksheet.getColumn(2 + TotalStudentsColumn + maxSubjects * 2).letter}${dataEndRow}, "PWG")`
  }

  // students with cp = 1
  worksheet.getCell(newBoxStartRow+17, TotalStudentsColumn + maxSubjects * 2).value = {
    formula: `COUNTIF(${worksheet.getColumn(3 + TotalStudentsColumn + maxSubjects * 2).letter}${dataStartRow}:${worksheet.getColumn(3 + TotalStudentsColumn + maxSubjects * 2).letter}${dataEndRow}, "1")`
  }

  // students with cp = 2
  worksheet.getCell(newBoxStartRow+18, TotalStudentsColumn + maxSubjects * 2).value = {
    formula: `COUNTIF(${worksheet.getColumn(3 + TotalStudentsColumn + maxSubjects * 2).letter}${dataStartRow}:${worksheet.getColumn(3 + TotalStudentsColumn + maxSubjects * 2).letter}${dataEndRow}, "2")`
  }

  //students with cp >= 3
  worksheet.getCell(newBoxStartRow+19, TotalStudentsColumn + maxSubjects * 2).value = {
    formula: `COUNTIF(${worksheet.getColumn(3 + TotalStudentsColumn + maxSubjects * 2).letter}${dataStartRow}:${worksheet.getColumn(3 + TotalStudentsColumn + maxSubjects * 2).letter}${dataEndRow}, ">=3")`
  }

  // pass percent =N89/N81*100
  worksheet.getCell(newBoxStartRow+20, TotalStudentsColumn + maxSubjects * 2).value = {
    formula: `Z${newBoxStartRow+15}/Z${newBoxStartRow+7}*100`
  }

  // total pass with pwg included =(N89+N90)/N81*100
  worksheet.getCell(newBoxStartRow+21, TotalStudentsColumn + maxSubjects * 2).value = {
    formula: `(Z${newBoxStartRow+15}+Z${newBoxStartRow+16})/Z${newBoxStartRow+7}*100`
  }

  // sgpas ka formula 
  {
    const cell = worksheet.getCell(newBoxStartRow+10, 1 + TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(1 + TotalStudentsColumn + maxSubjects * 2).letter;
    cell.value = { formula: `COUNTIF(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<6")` };
  }

  {
    const cell = worksheet.getCell(newBoxStartRow+11, 1 + TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(1 + TotalStudentsColumn + maxSubjects * 2).letter;
    // =COUNTIFS(N7:N68,">=255",N7:N68,"<425")
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=6", ${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<7.5")` };
  }

  {
    const cell = worksheet.getCell(newBoxStartRow+12, 1 + TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(1 + TotalStudentsColumn + maxSubjects * 2).letter;
    // =COUNTIFS(N7:N68,">=425",N7:N68,"<510")
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=7.5", ${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, "<9")` };

  }

  {
    const cell = worksheet.getCell(newBoxStartRow+13,1 + TotalStudentsColumn + maxSubjects * 2);
    const columnLetter = worksheet.getColumn(1 + TotalStudentsColumn + maxSubjects * 2).letter;
    // =COUNTIFS(N7:N68,">=510",N7:N68,"<637.5")
    cell.value = { formula: `COUNTIFS(${columnLetter}${dataStartRow}:${columnLetter}${dataEndRow}, ">=9")` };
  }

  






  await workbook.xlsx.writeFile(outputFilePath);
  console.log(`Data written to ${outputFilePath}`);
};

// Usage
const jsonFilePath = "out/results.json";
const templateFilePath = "src/template.xlsx";
const outputFilePath = "output.xlsx";
const startRow = 7;
const startColumn = 1;
