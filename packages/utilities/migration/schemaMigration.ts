import mongoose from 'mongoose';
import { writeFile } from 'fs/promises';
import StudentModel from '../models/Student'; // your updated schema
import { solver } from '../utils/solver';

const MONGO_URI = process.env.MONGO_URI!;
console.log('🔗 Connecting to MongoDB...',MONGO_URI);

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');
}

async function backupToFile(students: any[]) {
  const date = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `backup_students_${date}.json`;

  try {
    await writeFile(fileName, JSON.stringify(students, null, 2));
    console.log(`📁 Backup written to file: ${fileName}`);
  } catch (err) {
    console.error('❌ Failed to write JSON backup:', err);
    process.exit(1);
  }
}

async function backupToMongo(students: any[]) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
  const collectionName = `students_backup_${timestamp}`;

  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    const backupCollection = db.collection(collectionName);
    await backupCollection.insertMany(JSON.parse(JSON.stringify(students)));
    console.log(`🛡️ Backup MongoDB collection created: ${collectionName}`);
  } catch (err) {
    console.error('❌ Failed to create MongoDB backup:', err);
    process.exit(1);
  }
}

async function migrateAllStudents() {
  await connectDB();

  const allStudents = await StudentModel.find({branch: 'CS'});
  console.log(`📦 Found ${allStudents.length} student records`);

  // Step 1: Backup
  await backupToFile(allStudents);
  await backupToMongo(allStudents);

  // Step 2: Migrate
  for (const student of allStudents) {
    const rollNo = student.rollNo;
    const updatedData = await solver(Number(rollNo));

    if (!updatedData) {
      console.warn(`⚠️ No data for rollNo: ${rollNo}`);
      continue;
    }

    try {
      await StudentModel.updateOne(
        { _id: student._id },
        {
          ...updatedData,
          year: student.year, // preserve only `year`
        }
      );
      console.log(`✅ Updated: ${rollNo}`);
    } catch (error) {
      console.error(`❌ Failed to update ${rollNo}:`, error);
    }
  }

  console.log('🎯 Migration complete. Disconnecting...');
  await mongoose.disconnect();
}

migrateAllStudents().catch((err) => {
  console.error('🚨 Migration failed:', err);
  process.exit(1);
});
