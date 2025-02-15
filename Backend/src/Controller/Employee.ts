import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import Router from 'express';
import e, { Request, Response, NextFunction } from 'express';
import Employee from '../Model/Employee';
import Task from '../Model/Task';
import { IEmployee } from '../Model/Employee';
import { ITask } from '../Model/Task';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb'; // Add this import statement
import mongoose from 'mongoose';
import formatDate from '../utils/dateConverter';
import DepartmentModel from '../Model/Department';
import transporter, { mailOptions } from '../utils/mailService';
import { latestUpdateModel } from '../Model/Latest_update';
const router = Router();

// EditTask

// login
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { employeeId, department } = req.body;
      let employee = await Employee.findOne({ employeeId, department });
      console.log(employee);
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials',
        });
      } else {
        const token = jwt.sign(
          { email: employee.email, employeeId: employee.employeeId },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: '1h' }
        );
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({
          success: true,
          message: 'Login successfull',
          data: employee,
          EID: employeeId,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// token verification
const tokenVerification = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Access denied',
    });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.body.verified = verified;
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

// get the profile of the employee
router.get(
  '/profile/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = req.params.id;
      let employee = await Employee.findOne({ _id: employeeId });
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Invalid employee',
        });
      } else {
        return res.status(200).json({
          success: true,
          data: employee,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// get all task
router.get(
  '/task/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = req.params.id;

      const Employees = await Employee.findOne({ _id: employeeId });

      if (!Employees) {
        return res.status(400).json({
          success: false,
          message: 'Invalid employee',
        });
      }

      let tasks = await Task.find({
        department: Employees.department,
      });

      console.log('tasks', tasks);

      if (tasks.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No task found',
        });
      } else {
        return res.status(200).json({
          success: true,
          data: tasks,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// get the task
router.get(
  '/tasks/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = req.params.id;
      let employee = await Employee.findOne({ _id: employeeId });
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Invalid employee',
        });
      }

      const tasks = await Task.aggregate([
        {
          $group: {
            _id: '$category',
          },
        },
        {
          $match: { department: employee.department },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'department',
            foreignField: 'department',
            as: 'employee',
          },
        },
        {
          $unwind: '$employee',
        },
        {
          $project: {
            'employee.password': 0,
            'employee.profile': 0,
            'employee.createdAt': 0,
            'employee.updatedAt': 0,
            'employee.__v': 0,
          },
        },
      ]);

      if (tasks.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No task found',
        });
      }
      return res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

router.post(
  '/reply/:employeeid/:taskid',
  async (
    req: Request<
      { employeeid: string; taskid: string },
      {},
      { solution: string; Date: Date; Status: string }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { taskid, employeeid } = req.params;
      const { solution, Date, Status } = req.body;

      const employee = await Employee.findOne({ _id: employeeid });
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Invalid employee',
        });
      }
      // Find the task by ID
      let task = await Task.findOne({ _id: taskid });

      if (!task) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task',
        });
      }

      // Ensure task.solutions is an array before pushing a new solution

      await task.save();

      // Successfully added the solution
      return res.status(200).json({
        success: true,
        message: 'Solution added successfully',
      });
    } catch (err) {
      console.error(err); // Log the error for debugging

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

router.post('/update-all-at-once/:empId', async (req, res) => {
  const { empId } = req.params; // mongoose _id should be sent as params
  const {
    data: taskUpdates,
    comment,
    date,
    countOfCompleted,
    countOfPartial,
    countOfIncomplete,
  } = req.body;

  try {
    console.log('This is date', date);

    const employee = await Employee.findOne({ employeeId: empId });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee',
      });
    }
    const noOfDocumentsOfTask = await Task.countDocuments({
      department: employee.department,
    });
    const getEntryNumber = await DepartmentModel.findOne(
      {
        Name: employee.department,
      },
      { entryNumber: 1 }
    );
    let count = 0;

    await Employee.findOneAndUpdate(
      { employeeId: empId },
      {
        $push: { entryNumberByEmployee: getEntryNumber?.entryNumber },
        // Increment existing completed count
        $set: {
          'TasksCompleted.completed': countOfCompleted,
          'TasksCompleted.partial': countOfPartial,
          'TasksCompleted.incomplete': countOfIncomplete,
          'TasksCompleted.total': noOfDocumentsOfTask,
        }, // Set new total
      },
      { new: true }
    );

    const DateConvert = new Date(date).toISOString().split('T')[0];

    console.log('DateConvert', DateConvert);
    console.log(new Date().getTime());
    const result = taskUpdates.map(async (update: any) => {
      await Task.updateOne(
        { _id: update._id, department: employee.department },
        {
          $set: { status: update.status },
          $push: {
            solutions: {
              employee: employee._id,
              DateAdded: DateConvert,
              comment: comment,
              createdAt: new Date().getMilliseconds(),
              entryNumber: getEntryNumber?.entryNumber || 0,
            },
          },
        }
      );
    });

    const LastEntry = await latestUpdateModel.countDocuments({});
    await latestUpdateModel.create({
      employeeId: employee._id,
      slNo: LastEntry,
      DateAdded: DateConvert,
    });

    await DepartmentModel.updateOne(
      {
        Name: employee.department,
      },
      { $inc: { entryNumber: 1 } }
    );

    await Promise.all(result);

    const loadTemplate = (templateName: any, data: any) => {
      const filePath = path.join(
        __dirname,
        `../Mail_Template/${templateName}.html`
      );
      const templateSource = fs.readFileSync(filePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      return template(data);
    };
    const templateData = {
      name: employee.name,
      employeeId: empId,
      department: employee.department,
      complete: countOfCompleted,
      partial: countOfPartial,
      incomplete: countOfIncomplete,
      total: noOfDocumentsOfTask,
      comment: comment,
    };
    const emailContent = loadTemplate('template', templateData);

    let mailOptions = {
      from: 'varunpatil4498@gmail.com', // sender address
      to: 'varunpatil4498@gmail.com', // list of receivers
      subject: 'Aques Task Update', // Subject line
      html: emailContent, // HTML body (optional)
    };

    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.error('Error occurred: ', err);
        return;
      }
      console.log('Email sent: ', info.response);
    });
    return res.status(200).json({
      message: 'Tasks updated successfully',
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/get-updated-task-status', async (req, res) => {
  try {
    const upatedStatus = await Task.find({
      status: { $in: ['Completed', 'Partial', 'Incomplete'] },
    }).populate('solutions');
    console.log(upatedStatus);
    return res.status(200).json({
      success: true,
      data: upatedStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
