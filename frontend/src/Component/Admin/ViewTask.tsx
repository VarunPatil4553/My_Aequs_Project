import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AxiosAPI } from '../../AxiosApi';

const ViewTask: React.FC = () => {
  const [greeting, setGreeting] = useState('');

  const [data, setData] = useState([]);

  const getTasks = async () => {
    try {
      const response = await AxiosAPI.get('/admin/get-tasks');
      console.log(response.data.data);
      setData(response.data.tasks);
      console.log(response.data.tasks, 'response');
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    getTasks();
    const date = new Date();
    const currentHour = date.getUTCHours() - 5; // Convert to US Eastern Time (UTC-5)

    if (currentHour >= 0 && currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const changetaskStatus = async (id: any) => {
    try {
      const response = await AxiosAPI.put(`/admin/update-task/${id}`, {
        status: 'completed',
      });
      if (response.status === 200) {
        toast.success('Task Updated successfully');
        getTasks();
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deletetask = (id: string) => {
    try {
      const response = AxiosAPI.delete(`/admin/delete-task/${id}`);
      console.log(response);
      toast.warning('Oops Task Deleted');
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      {/* <section className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-6xl">
          {data && data.map((task:any, index:any) => (
            <div key={index} className="bg-white p-6 rounded-md shadow-md max-h-[300px] overflow-y-scroll">
              <h1 className="text-2xl font-serif mb-4">{task.task}</h1>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Deadline:</strong> {task.deadline}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Department:</strong> {task.department}</p>
              {task.solutions.map((solution:any,index:any) => (
                <div key={index} className="flex items-center mt-4">
                  <img src={`${BASE_URL}/uploads/employees/${solution.profile}`} alt="User" className="w-12 h-12 rounded-full mr-4"/>
                  <div className="">

                  <p><strong>Employee:</strong> {solution.name}</p> 
                  <p><strong>Reply:</strong> {solution.solution}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between mt-6">
               { task.status !== 'completed' ?<button 
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none"
                  onClick={() => changetaskStatus(task._id)}
                >
                  Mark as Completed
                </button> : null}
                <Link  to={`/dashboard/edittask/${task._id}`}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
                 
                >
                  Edit
                </Link>
                <button 
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none"
                  onClick={() => deletetask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section> */}
      <section className="container mx-auto p-6 font-mono min-h-screen">
        <div className="w-full mb-8 rounded-lg shadow-lg bg-white">
          <div className="w-full">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Category</th>
                  {/* <th className="px-4 py-2 text-left">Replies</th> */}
                  <th className="px-4 py-2 text-left">Update Single Task</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((task: any, index) => {
                    const categoryName = task.category;
                    let showCategory = true;

                    // Check if the category has already been displayed
                    if (
                      index > 0 &&
                      (data[index - 1] as { category: string })?.category ===
                        categoryName
                    ) {
                      showCategory = false;
                    }

                    return (
                      <React.Fragment key={task._id}>
                        {showCategory && (
                          <tr className="bg-red-500 font-bold text-lg">
                            <td colSpan={3} className="px-4 py-2">
                              {categoryName}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t border-gray-200">
                          <td className="px-4 py-2 w-2/6">
                            <div className="flex items-center text-sm">
                              <div>
                                <p className="font-semibold text-black">
                                  {task.task}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Description: {task.description}
                                </p>
                                {/* <p className="text-xs text-gray-600">
                                  Deadline: {task.deadline}
                                </p> */}
                                <p className="text-xs text-gray-600">
                                  Status: {task.status}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Department: {task.department}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* <td className="px-4 py-2 w-3/6 flex gap-1"> */}
                          {/* {task.solutions.map(
                              (solution: any, index: number) => (
                                <div
                                  key={index}
                                  className="bg-white rounded-lg p-3 border  border-gray-300"
                                >
                                  <p className="text-sm">
                                    {index + 1}. <strong>Name:</strong>{' '}
                                    {solution.name} &nbsp;{' '}
                                    <strong>Reply:</strong> {solution.solution}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <strong>Status:</strong> {solution.Status}{' '}
                                    &nbsp; <strong>Date:</strong>{' '}
                                    {solution.Date?.substring(0, 10)}
                                  </p>
                                </div>
                              )
                            )} */}
                          {/* {task.solutions} */}
                          {/* Replies will come here */}
                          {/* </td> */}
                          <td className="px-4 py-2 text-xs cursor-pointer bg-gray-50">
                            <details>
                              <summary className="text-sm">Update</summary>
                              <article className="p-2 flex justify-between gap-1">
                                <Link
                                  to={`/dashboard/edittask/${task._id}`}
                                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700 focus:outline-none"
                                >
                                  Edit
                                </Link>
                                <button
                                  className="bg-red-500 text-white p-2 rounded hover:bg-red-700 focus:outline-none"
                                  onClick={() => deletetask(task._id)}
                                >
                                  Delete
                                </button>
                                {task.status !== 'completed' ? (
                                  <button
                                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none"
                                    onClick={() => changetaskStatus(task._id)}
                                  >
                                    Mark as Completed
                                  </button>
                                ) : null}
                              </article>
                            </details>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewTask;
