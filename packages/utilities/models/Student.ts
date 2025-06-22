import mongoose, { Document, Schema } from 'mongoose';

interface Subject {
  subject: string;
  code: string;
  type: string;
  internal: string;
  external: string;
}

interface CarryOverObject {
  session: string;
  sem: string;
  cop: string;
}

interface Student extends Document {
  rollNo: string;
  enrollmentNo: string;
  fullName: string;
  fatherName: string;
  course: string;
  branch: string;
  year: number; // ✅ Added
  SGPA: Record<string, number>;
  CarryOvers: (string | CarryOverObject)[];
  divison: string;
  cgpa: string;
  instituteName: string;
  Subjects: Subject[];
  latestResultStatus: string;
  totalMarksObtained: number;
  latestCOP: string;
}

const SubjectSchema = new Schema<Subject>({
  subject: { type: String, required: true },
  code: { type: String, required: true },
  type: { type: String, required: true },
  internal: { type: String, required: true },
  external: { type: String, required: false },
});

const CarryOverObjectSchema = new Schema<CarryOverObject>({
  session: String,
  sem: String,
  cop: String,
}, { _id: false });

const StudentSchema = new Schema<Student>({
  rollNo: { type: String, required: true },
  enrollmentNo: { type: String, required: true },
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true }, // ✅ Added here
  SGPA: {
    type: Map,
    of: Number,
    required: false,
  },
  CarryOvers: {
    type: [Schema.Types.Mixed],
    default: [],
  },
  divison: { type: String, default: "" },
  cgpa: { type: String, default: "" },
  instituteName: { type: String, required: true },
  Subjects: {
    type: [SubjectSchema],
    default: [],
  },
  latestResultStatus: { type: String, default: "" },
  totalMarksObtained: { type: Number, default: 0 },
  latestCOP: { type: String, default: "" },
});

export default mongoose.model<Student>('Student', StudentSchema);
