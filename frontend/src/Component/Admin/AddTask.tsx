import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { AxiosAPI } from '../../AxiosApi';
import { Dept } from '../Home/Dept';

const getDepartments = async () => {
  try {
    const getDepts = await AxiosAPI.get('/admin/get-departments');
    console.log(getDepts.data.data);
    return getDepts.data.data;
  } catch (er: any) {
    console.log(er.message);
  }
};
const AddTask: React.FC = () => {
  const [departmentState, setDepartment] = useState<
    { Name: string; _id: string }[]
  >([]);
  const [data, setData] = useState({
    task: '',
    description: '',

    status: '',
    department: '',
    category: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
      department: selectedDepartment,
      category: selectedCategory,
    });
  };

  //

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await AxiosAPI.post('/admin/add-task', data);
      console.log(response);

      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('');
  const [tasks, setTasks] = useState<Array<any> | null>([]);

  const handleCategoryChange = (e: any) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    const selectedDept = Dept.find(
      (dept) => dept.Category === selectedCategory
    );
    if (selectedDept && selectedDepartment === 'Quality') {
      setTasks(selectedDept.tasks);
    } else {
      setTasks([]);
    }
  };
  const [selectedDepartment, setSelectedDepartment] = useState('');
  useEffect(() => {
    const depts = async () => {
      try {
        const departs = await getDepartments();
        setDepartment(departs);
      } catch (er: any) {
        console.log('inside effect', er.message);
      }
    };
    depts();
  }, []);
  return (
    <div>
      <div className=" pt-10">
        <h1 className="text-3xl  text-left mb-6 pl-5 text-red-500">
          Add Task...
        </h1>{' '}
        {/* Changed text-center to text-left */}
      </div>
      <div className="shadow-md rounded-md w-[50%] m-auto">
        <div className="w-[90%] m-auto flex justify-center py-5">
          <div className=" w-full max-w-xl">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="department" className="w-full ">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  onChange={(e: any) => setSelectedDepartment(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 "
                >
                  <option value="" className="text-gray-500">
                    {' '}
                    Select Department{' '}
                  </option>

                  {departmentState &&
                    departmentState.map(
                      (ele: { _id: string; Name: string }, index: number) => {
                        return (
                          <option key={index} value={ele.Name}>
                            {ele.Name}
                          </option>
                        );
                      }
                    )}
                  {/* <option value="Quality">Quality</option>

          <option value="Shipping & Receiving">Shipping & Receiving</option>

          <option value="Warehouse">Warehouse</option> */}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="w-full ">
                  Category
                </label>
                {/* {selectedDepartment !== 'Quality' ? ( */}
                <input
                  type="text"
                  name="category"
                  onChange={handleCategoryChange}
                  placeholder="category"
                  className="w-full border border-gray-300 p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              {/* ) : ( */}

              {/* <select
            name="category"
            id="category"
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>--select--</option> */}
              {/* <option value="Incoming Inspection">Incoming Inspection</option>
            <option value="Layout Table">Layout Table</option>
            <option value="Keyence Table">Keyence Table</option>
            <option value="CMM">CMM</option>
            <option value="Visual Inspection">Visual Inspection</option>
            <option value="General Area">General Area</option> */}
              {/* {selectedDepartment === 'Quality' &&
              Dept.map((dept) => (
                <option key={dept.Category} value={dept.Category}>
                  {dept.Category}
                </option>
              ))}
          </select> */}
              {/* )} */}
              <div>
                <label htmlFor="task" className="w-full ">
                  {' '}
                  Task
                </label>

                {/* {selectedDepartment !== 'Quality' ? ( */}
                <input
                  type="text"
                  name="task"
                  onChange={handleChange}
                  placeholder="Task"
                  className="w-full border border-gray-300 p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              {/* ) : (
          <select
            name="task"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--select task--</option> */}
              {/* {tasks &&
              tasks.map((task: any) => (
                <option key={task} value={task}>
                  {task}
                </option>
              ))}
          </select> */}
              {/* )} */}
              <div>
                <label htmlFor="task" className="w-full ">
                  {' '}
                  Description
                </label>
                <textarea
                  placeholder="Please Add Description it is mandatory...."
                  name="description"
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                />
              </div>

              {/* <select
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select> */}

              <button
                type="submit"
                className="w-full bg-gray-500 text-white p-2 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
