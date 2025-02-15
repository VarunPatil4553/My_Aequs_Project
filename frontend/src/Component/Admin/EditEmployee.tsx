import React from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';

import { AxiosAPI } from '../../AxiosApi';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

type Employee = {
  name: string;
  email: string;

  employeeId: string;
  department: string;
};

const EditEmployee: React.FC = () => {
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

  const { id } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = {
        name: data.name,
        email: data.email,
        employeeId: data.employeeId,
        department: data.department,
      };
      const res = await AxiosAPI.put(`/admin/update-employee/${id}`, formData);
      if (res.status === 200) {
        toast.success('Employee Update Successfully');
      }
      navigate('/dashboard/viewemployee');
    } catch (error) {
      toast.error('Failed to Add Employee');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md">
        <h1 className="text-3xl text-center mb-6">Edit Employee</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            name="employeeId"
            onChange={handleChange}
            placeholder="Employee ID"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <select
            name="department"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {' '}
            <option value="">Choose dept</option>
            <option value="Quality">Quality</option>
            {/* <option value="Bay 1">Bay 1</option>
            <option value="Bay 2">Bay 2</option>
            <option value="Bay 3">Bay 3</option> */}
            <option value="Shipping & Receiving">Shipping & Receiving</option>
            {/* <option value="Assembly">Assembly</option> */}
            <option value="Warehouse">Warehouse</option>
          </select>

          {/* <input
            type="text"
            name="department"
            onChange={handleChange}
            placeholder="Department"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> */}

          <button
            type="submit"
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
