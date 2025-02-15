import mongoose from 'mongoose';

export interface IEmployee extends mongoose.Document {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  entryNumberByEmployee: [];
}

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  entryNumberByEmployee: [{ type: Number }],
  TasksCompleted: {
    completed: { type: Number, default: 0, require: true, min: 0 },
    partial: { type: Number, default: 0, require: true, min: 0 },
    incomplete: { type: Number, default: 0, require: true, min: 0 },
    total: { type: Number, default: 0, require: true },
  },
  email: {
    type: String,
    required: true,
  },

  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: [true, 'Employee ID already exists'],
  },

  department: {
    type: String,
    required: true,
  },
});

let Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
