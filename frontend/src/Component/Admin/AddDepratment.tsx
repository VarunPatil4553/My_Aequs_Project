import React, { useEffect, useState } from 'react';
import { AxiosAPI } from '../../AxiosApi';

import { toast } from 'react-toastify';

const getAllDepts = async () => {
  try {
    const response = await AxiosAPI.get('/admin/get-departments');
    return response.data.data;
  } catch (er: any) {
    console.log(er.message);
  }
};

export default function AddDepratment() {
  const [addDepthCheckList, setaddDepthCheckList] = useState<boolean>(false);

  const [deptName, setDeptname] = useState<string>('');
  const [Alldepts, setAlldepts] = useState<{ Name: 'string' }[]>([]);
  const [EditName, setEditName] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeptname(e.target.value);
  };
  // const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (deptName === '') {
        return toast('OOPS: Department Feild is Empty...');
      }
      const response = await AxiosAPI.post('/admin/add-dept', {
        department: deptName,
      });
      console.log(response);
      setAlldepts([...response.data.data]);
      setaddDepthCheckList(false);
      setDeptname('');
      // navigate('/dashboard/addemployee');
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await AxiosAPI.delete(`/admin/delete-department/${id}`);
      console.log(response.data);
      setAlldepts([...response.data.data]);
    } catch (er: any) {
      console.log(er.message);
    }
  };
  const handleEdit = async (id: string) => {
    const singleData = Alldepts.filter((ele: any) => {
      return ele._id === id;
    });
    setDeptname(singleData[0].Name);
    setEditName(true);
    setEditId(id);
    setaddDepthCheckList(true);
  };
  const HandleEditUpdate = async () => {
    try {
      setEditId('');
      setEditName(false);

      if (deptName === '') {
        return toast('OOPS: Department Feild is Empty...');
      }
      const response = await AxiosAPI.put(
        `/admin/update-department/${editId}`,
        {
          Name: deptName,
        }
      );
      setAlldepts([...response.data.data]);
      setDeptname('');
      setEditName(false);
      setEditId('');
      setaddDepthCheckList(false);
    } catch (er: any) {
      console.log(er.message);
    }
  };
  useEffect(() => {
    const callFunction = async () => {
      const data = await getAllDepts();
      setAlldepts([...data]);
    };
    callFunction();
  }, []);

  return (
    <div className="">
      <div className="pt-10">
        <h1 className="text-3xl  text-left mb-6 pl-5 text-red-500 fixed">
          Departments...
        </h1>{' '}
        {/* Changed text-center to text-left */}
      </div>
      <div className="flex justify-center min-h-screen mt-10">
        <div className="w-full max-w-xl p-4">
          <div className="shadow-lg px-5 py-5 rounded-md bg-gray-100">
            {!addDepthCheckList ? (
              Alldepts && (
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">
                      Add Department
                    </h3>
                    <button
                      className="text-2xl text-black hover:text-blue-700 transition duration-300"
                      onClick={() => setaddDepthCheckList(true)}
                    >
                      ✚
                    </button>
                  </div>

                  <div className="space-y-4 mt-4 ">
                    {Alldepts.map((ele: any) => (
                      <div
                        key={ele._id}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                      >
                        <div>{ele.Name}</div>
                        <div>
                          <button
                            onClick={() => handleDelete(ele._id)}
                            className="mr-4"
                          >
                            🗑️
                          </button>
                          <button onClick={() => handleEdit(ele._id)}>
                            ✏️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-gray-800">
                    Add Department
                  </h2>

                  <div>
                    <label
                      htmlFor="empID"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter Department name:
                    </label>
                    <input
                      type="text"
                      value={deptName}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg outline-none text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      onChange={handleChange}
                    />
                  </div>

                  {EditName ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <button
                          onClick={HandleEditUpdate}
                          type="submit"
                          className="w-full px-4 py-2 mt-4 text-white bg-gray-500 rounded-lg hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Update Department
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full px-4 py-2 mt-4 text-white bg-gray-500 rounded-lg hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
                    >
                      Add Department
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
