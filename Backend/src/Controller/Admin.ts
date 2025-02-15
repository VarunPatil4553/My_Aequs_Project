import Router from 'express';
import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import Employee from '../Model/Employee';
import { IEmployee } from '../Model/Employee';
import { ITask } from '../Model/Task';
import Task from '../Model/Task';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import formatDate from '../utils/dateConverter';
import DepartmentModel from '../Model/Department';
import transporter, { mailOptions } from '../utils/mailService';
import { latestUpdateModel } from '../Model/Latest_update';
import { sortData } from '../utils/Sort_Get_tasks';

const router = Router();

// Middleware

// Login

interface ILogin {
  email: string;
  password: string;
}

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: ILogin = req.body;

    if (email === 'admin@gmail.com' && password === 'admin') {
      const token = Jwt.sign(
        { email: email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1h' }
      );
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({
        success: true,
        message: 'Login Success',
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid Credentials',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

// JWT VERIFY
const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (token) {
    Jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          res.status(401).json({
            success: false,
            message: 'Unauthorized',
          });
        } else {
          next();
        }
      }
    );
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};

//  Add the Employee
const uploadPath = path.join(__dirname, '../uploads/employees');

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Your existing multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  try {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      new Error('Invalid Image File');
    }
  } catch (e) {
    console.log(e);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post('/add-employee', async (req: any, res: Response) => {
  try {
    const { name, email, employeeId, department } = req.body;
    console.log(req.body);
    const employee = await Employee.findOne({
      employeeId: employeeId,
      email: email,
    });

    if (employee) {
      res.status(400).json({
        success: false,
        message: 'Employee Already Exists',
      });
    }
    const NewEmployee = await Employee.create({
      name,
      email,
      employeeId,
      department,
    });

    if (NewEmployee) {
      res.status(200).json({
        success: true,
        message: 'Employee Added Successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to Add Employee',
      });
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
});

// Get All Employees
router.get(
  '/get-employees',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await Employee.find();
      if (employees.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No Employees Found',
        });
      } else {
        res.status(200).json({
          success: true,
          employees,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// Get Employee By ID
router.get(
  '/get-employee/:id',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        res.status(400).json({
          success: false,
          message: 'Employee Not Found',
        });
      } else {
        res.status(200).json({
          success: true,
          employee,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// Update Employee By ID
router.put(
  '/update-employee/:id',

  async (req: any, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        email,

        employeeId,
        department,
      }: IEmployee = req.body;

      const employee = await Employee.findByIdAndUpdate(req.params.id, {
        name,
        email,

        employeeId,

        department,
      });

      if (!employee) {
        res.status(400).json({
          success: false,
          message: 'Employee Not Found',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Employee Updated Successfully',
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// Delete Employee By ID
router.delete(
  '/delete-employee/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) {
        res.status(400).json({
          success: false,
          message: 'Employee Not Found',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Employee Deleted Successfully',
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// add task
router.post(
  '/add-task',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task, description, department, category }: ITask = req.body;
      const employees = await Employee.find({ department: department });
      console.log(employees.length, employees);
      if (employees.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No Employees Found',
        });
      } else {
        await Task.create({
          task,
          description,

          status: 'Pending',
          department,
          category,
          solutions: [],
        });
        console.log({
          task,
          description,

          status: 'Pending',
          department,
          category,
          solutions: [],
        });

        res.status(200).json({
          success: true,
          message: 'Task Added Successfully',
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// Get All Tasks
router.get(
  '/get-tasks',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await Task.find();

      if (tasks.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No Tasks Found',
        });
      } else {
        res.status(200).json({
          success: true,
          tasks,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// Get Task By ID
router.get(
  '/get-task/:id',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        res.status(400).json({
          success: false,
          message: 'Task Not Found',
        });
      } else {
        res.status(200).json({
          success: true,
          task,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// Update Task By ID
router.put(
  '/update-task/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task, description, deadline, status }: ITask = req.body;
      const tasks = await Task.findByIdAndUpdate(req.params.id, {
        task,
        description,
        deadline,
        status,
      });
      if (!tasks) {
        res.status(400).json({
          success: false,
          message: 'Task Not Found',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Task Updated Successfully',
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// Delete Task By ID
router.delete(
  '/delete-task/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        res.status(400).json({
          success: false,
          message: 'Task Not Found',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Task Deleted Successfully',
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// change status
router.put(
  '/change-status/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const id: string = req.params.id;
    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Task',
        });
      }
      const updatedTask = await Task.findByIdAndUpdate(id, { status: status });
      if (!updatedTask) {
        return res.status(400).json({
          success: false,
          message: 'Failed to update task',
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'Task Updated Successfully',
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// dashboard
router.get(
  '/dashboard',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Employee.countDocuments();
      const tasks = await Task.countDocuments();
      const completedtask = await Task.countDocuments({ status: 'completed' });

      if (data === 0 && tasks === 0 && completedtask === 0) {
        res.status(400).json({
          success: false,
          message: 'No Data Found',
        });
      } else {
        res.status(200).json({
          success: true,
          data,
          tasks,
          completedtask,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// Logout
router.get(
  '/logout',
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('token');
      res.status(200).json({
        success: true,
        message: 'Logout Success',
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

router.get('/get-task-updates', async (req, res) => {
  try {
    const getUpdatedTasks = await Task.aggregate([
      {
        $match: {
          status: { $in: ['Completed', 'Partial', 'Incomplete'] },
        },
      },
      {
        $unwind: '$solutions',
      },

      {
        $group: {
          _id: {
            employee: '$solutions.employee',
            dateAdded: '$solutions.DateAdded', // Group by DateAdded
          },
          count: { $sum: 1 }, // Count occurrences
          createdAt: { $first: '$createdAt' }, // Capture createdAt from the original document
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id.employee',
          foreignField: '_id',
          as: 'employeeDetails',
        },
      },
      {
        $unwind: {
          path: '$employeeDetails',
          preserveNullAndEmptyArrays: true, // Optional: Keep documents without matching employees
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field from the output
          count: 1, // Include the count
          createdAt: 1, // Include createdAt
          deadline: 1, // Include deadline
          DateAdded: '$_id.dateAdded', // Include DateAdded
          employeeId: '$_id.employee', // Include employeeId
          employeeInfo: {
            _id: '$employeeDetails._id', // Include employee _id
            name: '$employeeDetails.name', // Include employee name
            email: '$employeeDetails.email', // Include employee email
            employeeId: '$employeeDetails.employeeId', // Include employeeId
            TaskCompleted: '$employeeDetails.TasksCompleted',
            department: '$employeeDetails.department', // Include department
            __v: '$employeeDetails.__v', // Include version key
          },
        },
      },
    ]);
    const SortedUpdates = await latestUpdateModel
      .find({}, {})
      .sort('-slNo')
      .populate('employeeId');

    console.log('getUpdatedTasks: ', getUpdatedTasks);

    const sortedData = await sortData(getUpdatedTasks, SortedUpdates);
    return res.status(200).json({
      success: true,
      SortedUpdates,
      data: sortedData,
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

router.get(
  '/get-task-update-of-single-user/:employee_id/:empUId',
  async (req, res) => {
    try {
      const { employee_id, empUId } = req.params;

      const DateConvert = new Date().toISOString().split('T')[0];

      const getDeptNamefromUser = await Employee.findOne(
        { _id: employee_id },
        {
          department: 1,
          entryNumberByEmployee: 1,
        }
      );

      // const getEntryNumber = await DepartmentModel.findOne(
      //   {
      //     Name: getDeptNamefromUser?.department,
      //   },
      //   { entryNumber: 1 }
      // );
      const entryArrayLength = getDeptNamefromUser?.entryNumberByEmployee ?? [];
      const targetEntryNumber =
        entryArrayLength.length === 0
          ? 0
          : entryArrayLength[entryArrayLength.length - 1];

      console.log('getEntryNumber: ', getDeptNamefromUser);
      console.log('targetEntryNumber:', targetEntryNumber);

      // Modified query to match solutions array elements with correct entryNumber
      const singleUserdata = await Task.find({
        solutions: {
          $elemMatch: {
            entryNumber: targetEntryNumber,
            employee: employee_id,
            DateAdded: { $lte: DateConvert },
          },
        },
      }).populate('solutions.employee');

      // Rest of your code remains the same...
      const singleUserdata1 = await Task.aggregate([
        {
          $match: {
            $expr: {
              $gte: [{ $size: '$solutions' }, 0],
            },
          },
        },
        { $unwind: '$solutions' },
        {
          $group: {
            _id: '$solutions.employee',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: '_id',
            foreignField: '_id',
            as: 'EmployeeName',
          },
        },
        {
          $project: {
            _id: 0,
            employeeId: '$EmployeeName.employeeId',
            department: '$EmployeeName.department',
            name: '$EmployeeName.name',
            count: 1,
          },
        },
        {
          $match: {
            employeeId: empUId,
          },
        },
      ]);

      return res.status(200).send({
        data: singleUserdata,
        name: singleUserdata1[0]?.name,
        department: singleUserdata1[0]?.department,
        employeeId: singleUserdata1[0]?.employeeId,
        count: singleUserdata1[0]?.count,
        success: true,
        message: 'Data fetched successfully..',
        entryNumber: targetEntryNumber,
      });
    } catch (er) {
      return res.status(500).send({
        success: false,
        message: er instanceof Error ? er.message : 'Internal Server error',
      });
    }
  }
);

router.post('/add-dept', async (req, res) => {
  const { department } = req.body;
  try {
    const checkDept = await DepartmentModel.findOne({ Name: department });
    console.log('Name already exists: ', checkDept);
    if (checkDept) {
      return res.status(400).send({ message: 'Department Already Exists...' });
    }
    const depth = await DepartmentModel.create({
      Name: department,
    });

    const data = await DepartmentModel.find();
    return res
      .status(200)
      .send({ message: 'depatment created successfully..', data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
router.get('/get-departments', async (req, res) => {
  const { department } = req.body;
  try {
    const data = await DepartmentModel.find();
    return res
      .status(200)
      .send({ message: 'depatment created successfully..', data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.delete('/delete-department/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await DepartmentModel.findByIdAndDelete(id);
    const data = await DepartmentModel.find();

    return res
      .status(200)
      .send({ message: 'depatment created successfully..', data });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.put('/update-department/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Name } = req.body;
    const checkDept = await DepartmentModel.findOne({ Name: Name });
    console.log(checkDept);
    if (checkDept) {
      return res.status(400).send({ message: 'Department Already Exists...' });
    }
    const response = await DepartmentModel.findByIdAndUpdate(id, {
      Name: Name,
    });
    const data = await DepartmentModel.find();
    return res
      .status(200)
      .send({ message: 'depatment created successfully..', data });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
