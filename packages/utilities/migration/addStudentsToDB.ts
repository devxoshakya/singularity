import mongoose from 'mongoose';
import fs from 'fs/promises';
import StudentModel from '../models/Student';
import { solver } from '../utils/solver';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aktu-results';
const FILE_PATH = 'lateral_entry.txt'; // 🔁 Update path if needed
const DEFAULT_YEAR = 2;

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');
}

async function readRollNos(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

async function processRollNos(rollNos: string[]) {
  for (const rollNo of rollNos) {
    const result = await solver(Number(rollNo));

    if (!result) {
      console.warn(`⚠️ No data for ${rollNo}`);
      continue;
    }

    try {
      await StudentModel.create({
        ...result,
        year: DEFAULT_YEAR,
      });
      console.log(`✅ Inserted ${rollNo}`);
    } catch (err) {
      console.error(`❌ Failed to insert ${rollNo}:`, err);
    }
  }
}

async function main() {
  await connectDB();

  const rollNos = await readRollNos(FILE_PATH);
  console.log(`📄 Read ${rollNos.length} roll numbers from file`);

  await processRollNos(rollNos);

  await mongoose.disconnect();
  console.log('🎯 Done.');
}

main().catch(err => {
  console.error('💥 Script failed:', err);
  process.exit(1);
});
