import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { AxiosAPI } from '../../AxiosApi';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';
// get departments
const getDepartments = async () => {
  try {
    const AlRes = await AxiosAPI.get('/admin/get-departments');

    console.log(AlRes.data.data);
    return AlRes.data.data;
  } catch (er: any) {
    console.log(er.message);
  }
};

const ViewEmployee: React.FC = () => {
  const [data, setData] = useState([]);
  const [depts, setdepts] = useState<{ _id: string; Name: string }[]>([]);
  const [copyData, setCopyData] = useState([]);
  const gettingData = async () => {
    try {
      const res = await AxiosAPI.get('/admin/get-employees');
      setData(res.data.employees);
      setCopyData(res.data.employees);
      console.log(res.data.employees);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    gettingData();
    const getDEpts = async () => {
      const x = await getDepartments();
      setdepts([...x]);
    };
    getDEpts();
  }, []);

  const deleteEmployee = async (id: any) => {
    try {
      const response = await AxiosAPI.delete(`admin/delete-employee/${id}`);
      console.log(response);
      gettingData();
    } catch (error) {
      console.log(error);
      toast.error('Some Went Wroung try After Some times');
    }
  };
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);

    const x = copyData.filter((item: any) => {
      console.log(typeof item, item);
      return item.department == e.target.value;
    });
    if (e.target.value == '') {
      return setData(copyData);
    }
    setData(x);
  };

  // EditEmployee

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <label
            htmlFor="department"
            className="block text-lg font-medium text-red-700 mb-2"
          >
            Select Department
          </label>
          <select
            name="department"
            id="department"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={handleChange}
          >
            <option value="">Choose department</option>
            {depts &&
              depts.map((ele: { _id: string; Name: string }, index: number) => (
                <option key={index} value={ele.Name}>
                  {ele.Name}
                </option>
              ))}
          </select>
        </div>

        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data &&
              data.map((employee: any, index: any) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-6 border-t-4 border-red-500 hover:shadow-lg transition duration-300"
                >
                  <h1 className="text-xl font-bold text-gray-800 text-center mb-3">
                    {employee.name}
                  </h1>
                  <p className="text-gray-600 mb-2">
                    <strong>Email:</strong> {employee.email}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Employee ID:</strong> {employee.employeeId}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Department:</strong> {employee.department}
                  </p>

                  <div className="flex justify-between mt-4">
                    <Link
                      to={`/dashboard/editemployee/${employee._id}`}
                      className="bg-gray-500 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Edit
                    </Link>
                    <button
                      className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700"
                      onClick={() => deleteEmployee(employee._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewEmployee;
