import React from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';

import { AxiosAPI } from '../../AxiosApi';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditTask: React.FC = () => {
  const [data, setData] = useState({
    task: '',
    description: '',
    deadline: '',
    status: '',
    department: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  // EditTask

  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await AxiosAPI.put(`/admin/update-task/${id}`, data);
      if (response.status === 200) {
        toast.success('Task Updated successfully');
      }
      navigateTo('/dashboard/viewtask');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-md">
        <h1 className="text-3xl font-serif text-center mb-6">Edit Task</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="task"
            onChange={handleChange}
            placeholder="Task"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            placeholder="Description"
            name="description"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
          />
          <input
            type="date"
            name="deadline"
            onChange={handleChange}
            placeholder="Deadline"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <select className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            id="department"
            name="department"
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 "
          >
            <option value="">--select --</option>

            <option value="Quality">Quality</option>

            <option value="Shipping & Receiving">Shipping & Receiving</option>

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
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
