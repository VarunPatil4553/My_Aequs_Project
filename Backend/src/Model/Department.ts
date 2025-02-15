import mongoose from 'mongoose';

export interface IDepartment extends mongoose.Document {
  Name: string;
  entryNumber: number;
}

const DepartmentSChema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true,
    },

    entryNumber: { type: Number, require: true },
  },
  { versionKey: false }
);

const DepartmentModel = mongoose.model<IDepartment>(
  'Department',
  DepartmentSChema
);

export default DepartmentModel;
