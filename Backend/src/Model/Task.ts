import mongoose, { connect, Document } from 'mongoose';

// Define the solution interface
export interface ISolution {
  employee: mongoose.Schema.Types.ObjectId | string;
  solution: string[];
  employeename: string;
  employeprofile: string;
  Date: Date;
  Status: string;
  entryNumber: number;
}

// Define the task interface
export interface ITask extends Document {
  task: string;
  description: string;
  deadline: string;
  status: string;
  employee: mongoose.Schema.Types.ObjectId | string;
  solutions: {
    createdAt: number;
    comment: string;
    DateAdded: string;
    employee: mongoose.Schema.Types.ObjectId;
    entryNumber: number;
  }[];
  createdAt: Date;
  department: string;
  category: string;
}

// Define the task schema
const TaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Completed',
  },
  solutions: [
    {
      createdAt: { type: Number, default: new Date() },
      comment: { type: String, default: '' },
      DateAdded: { type: String },
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
      entryNumber: { type: Number },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

// Pre-save middleware with correct typing
TaskSchema.pre('save', function (next) {
  // Using proper type for 'this' in Mongoose middleware
  const doc = this as unknown as mongoose.Document & ITask;

  // Only process if solutions array is modified
  if (doc.isModified('solutions')) {
    const solutions = doc.solutions;

    // Get the last solution's entry number (if it exists)
    const lastEntryNumber =
      solutions.length > 1 ? solutions[solutions.length - 2].entryNumber : 0;

    // Set the entry number for the new solution
    if (solutions.length > 0) {
      const newSolution = solutions[solutions.length - 1];
      if (!newSolution.entryNumber) {
        newSolution.entryNumber = lastEntryNumber + 1;
      }
    }
  }

  next();
});

// Create and export the Task model
const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
