import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
// import { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { AxiosAPI } from '../../AxiosApi';
import { useNavigate } from 'react-router-dom';

type Employee = {
  name: string;
  email: string;

  employeeId: string;
  department: string;
};
const getDepartments = async () => {
  try {
    const getDepts = await AxiosAPI.get('/admin/get-departments');
    console.log(getDepts.data.data);
    return getDepts.data.data;
  } catch (er: any) {
    console.log(er.message);
  }
};
const AddEmployee: React.FC = () => {
  const [departmentState, setDepartment] = useState<
    { Name: string; _id: string }[]
  >([]);
  const [data, setData] = useState<Employee>({
    name: '',
    email: '',

    employeeId: '',
    department: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const navigateTo = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = {
        name: data.name,
        email: data.email,
        employeeId: data.employeeId,
        department: data.department,
      };
      // = new FormData();
      // formData.append('name', data.name);
      // formData.append('email', data.email);
      // formData.append('phone', data.phone);
      // formData.append('address', data.address);
      // formData.append('employeeId', data.employeeId);
      // formData.append('department', data.department);
      // formData.append('designation', data.designation);
      // formData.append('salary', data.salary.toString());
      // formData.append('password', data.password);
      // formData.append('profile', profile as File);

      const res = await AxiosAPI.post('/admin/add-employee', formData);
      if (res.status === 200) {
        toast.success('Employee Added Successfully');
        navigateTo('/dashboard/viewemployee');
      }
    } catch (error) {
      toast.error('Failed to Add Employee');
    }
  };

  useEffect(() => {
    const depts = async () => {
      try {
        const departs = await getDepartments();
        console.log(departs);
        setDepartment([...departs]);
      } catch (er: any) {
        console.log('inside effect', er.message);
      }
    };
    depts();
  }, []);

  return (
    <div>
      <div className="pt-10 pl-5">
        <h1 className="text-3xl text-left mb-6 text-red-500">
          {' '}
          Add Employee...
        </h1>{' '}
        {/* Changed text-center to text-left */}
      </div>
      <div className="w-[50%] shadow-md rounded-md m-auto px-5 py-5  pt-10">
        <div className="flex justify-center ">
          <div className="w-full max-w-xl">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md shadow-md"
              />
              <input
                type="text"
                name="employeeId"
                onChange={handleChange}
                placeholder="Employee ID"
                className="w-full border border-gray-300 p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="department"
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose department</option>
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
              </select>
              <button
                type="submit"
                className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                Add Employee
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
