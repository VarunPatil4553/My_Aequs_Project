import mongoose from 'mongoose';

const file = {
  employeeId: { type: mongoose.Types.ObjectId, ref: 'Employee' },
  slNo: { type: Number, require: true, unique: true },
  DateAdded: { type: String, require: true },
};

const Latest_Update_Schema = new mongoose.Schema(file, { versionKey: false });

export const latestUpdateModel = mongoose.model(
  'Latest_Update_Employee',
  Latest_Update_Schema
);
