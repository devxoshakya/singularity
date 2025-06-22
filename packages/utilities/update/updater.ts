import mongoose from 'mongoose';
import StudentModel from '../models/Student';
import { solver } from '../utils/solver';

const MONGO_URI = process.env.MONGO_URI!;
const TARGET_YEAR = 2; // 👈 Change this to update for a different year

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');
}

async function updateStudentsByYear(year: number) {
  await connectDB();

  const students = await StudentModel.find({ year });
  console.log(`🎯 Found ${students.length} students with year = ${year}`);

  for (const student of students) {
    const rollNo = student.rollNo;
    try {
      const updatedData = await solver(Number(rollNo));

      if (!updatedData) {
        console.warn(`⚠️ No data returned for ${rollNo}`);
        continue;
      }

      await StudentModel.updateOne(
        { _id: student._id },
        {
          ...updatedData,
          year: student.year, // 🔒 Preserve year
        }
      );

      console.log(`✅ Updated: ${rollNo}`);
    } catch (err) {
      console.error(`❌ Failed to update ${rollNo}:`, err);
    }
  }

  await mongoose.disconnect();
  console.log('👋 Disconnected. Update finished.');
}

updateStudentsByYear(TARGET_YEAR).catch(err => {
  console.error('🚨 Script failed:', err);
  process.exit(1);
});
