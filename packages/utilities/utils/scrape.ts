import { writeFile, appendFile } from "fs/promises";
import { solver } from "./solver";

const branches = {
  "BT": "2400680549000",
  "CE": "2400680009000",
  "CH": "2400680519000",
  "CS": "2400680129000",
  "CS & IT": "2400680119000",
  "CS (AI)": "2400681529000",
  "CS (AIML)": "2400681539000",
  "CS (DS)": "2400681549000",
  "CS (IOT)": "2400681559000",
  "CSE": "2400680109000",
  "EC": "2400680319000",
  "EE": "2400680209000",
  "IT": "2400680139000",
  "ME": "2400680409000"
};

// Simulated data-checking function — replace with real logic


async function main() {
  await writeFile("lateral_entry.txt", ""); // clear file

  for (const [branch, base] of Object.entries(branches)) {
    let consecutiveNulls = 0;
    
    for (let i = 1; i <= 590; i++) {
      const rollNo = String(BigInt(base) + BigInt(i));
      const isValid = await solver(parseInt(rollNo));

      if (isValid === null) {
        consecutiveNulls++;
        console.log(`⚠️  Null response for ${rollNo} (${consecutiveNulls}/3)`);
        
        if (consecutiveNulls >= 10) {
          console.log(`🚫 Skipping branch ${branch} - 3 consecutive nulls detected`);
          break;
        }
      } else {
        consecutiveNulls = 0; // reset counter on non-null response
        
        if (isValid) {
          console.log(`✅ Found valid roll number: ${rollNo}`);
          await appendFile("lateral_entry.txt", `${rollNo}\n`);
        } else {
          console.log(`❌ Skipped: ${rollNo}`);
        }
      }
    }
  }
}

main().catch(console.error);
