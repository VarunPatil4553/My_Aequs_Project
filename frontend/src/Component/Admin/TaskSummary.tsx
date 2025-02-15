import React, { useEffect, useState } from 'react';
import { AxiosAPI } from '../../AxiosApi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// import TableComp from '../loader/TableComp';
export function formatDate(date: Date): string {
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`; // Format as MM/d/yyyy
}
function ViewTask2() {
  const [mainData, setMainData] = useState({
    search: [],
    data: [],
  });
  const [date, Setdate] = useState<Date>(new Date());
  const [lastFetchTime, setLastFetchTime] = useState<number>(0); // Track the last fetch time

  const getTasks = async () => {
    const currentTime = Date.now();
    // Check if 30 seconds (30000 ms) have passed since the last fetch
    if (currentTime - lastFetchTime < 30000) {
      return; // Exit if the time condition is not met
    }

    console.log(currentTime, lastFetchTime);
    setLastFetchTime(currentTime); // Update the last fetch time

    try {
      const response = await AxiosAPI.get('/admin/get-task-updates');

      // console.log(response.data.data);
      // console.log(response.data.data, 'response');
      // let x = response.data.data.map((ele: any) => {
      //   return {
      //     ...ele,
      //     createdAt: new Date(ele.createdAt).getMilliseconds(),
      //   };
      // });

      // const SortedData = x.reverse();

      // console.log(SortedData, 'Sorted');

      setMainData({
        ...mainData,
        // search: response.data.data,
        // data: response.data.data,
        search: response.data.SortedUpdates,
        data: response.data.SortedUpdates,
      });
      console.log(response.data.data, 'response');
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };
  const HandleSearchId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const copy = [...mainData.search];
    const x = copy.filter((item: any) => {
      console.log(typeof item, item);
      return (
        item.employeeId.employeeId.includes(e.target.value) ||
        item.employeeId.department
          .toLocaleLowerCase()
          .includes(e.target.value.toLocaleLowerCase())
      );
    });
    if (e.target.value == '') {
      return setMainData({ ...mainData, data: copy });
    }
    return setMainData({ ...mainData, data: x });
  };

  const handleSetDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    Setdate(new Date(e.target.value));
    console.log(e.target.value);
    const copy = [...mainData.search];
    const filteredDate = copy.filter((item: any) => {
      return item.DateAdded == e.target.value;
    });

    if (e.target.value == '') {
      return setMainData({ ...mainData, data: copy });
    }
    return setMainData({ ...mainData, data: filteredDate });
  };
  const handleREsetSort = () => {
    setMainData({
      ...mainData,
      data: mainData.search,
    });
  };
  useEffect(() => {
    // const timer = setTimeout(() => {
    getTasks();
    // }, 10000); // Call getTasks after 2 minutes
    // return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <div className="relative bg-gray-50">
      {/* Fixed header section that spans full width minus sidebar */}
      <div className="fixed top-0 left-[240px] right-0 bg-gray-50 z-50 border-b border-gray-200 shadow-sm mt-24">
        <div className="pb-4 pt-10">
          <h1 className="text-2xl text-left text-red-500 font-semibold pl-5">
            Task Completion Summary...
          </h1>
        </div>

        <div className="p-5">
          <div className="flex space-x-4">
            {/* Search by ID and Department */}
            <input
              id="input"
              type="text"
              placeholder="Search by ID or Department..."
              onChange={HandleSearchId}
              className="border border-gray-300 rounded-md p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
            />
            {/* Search by Date */}
            <input
              id="input"
              type="date"
              value={date.toISOString().split('T')[0]}
              onChange={handleSetDate}
              className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
            />
            {/* <button
              className="bg-red-500 rounded-lg text-white px-5"
              onClick={handleREsetSort}
            >
              Reset
            </button> */}
          </div>
        </div>
      </div>

      {/* Main content with padding to account for fixed header */}
      <div className="mt-48">
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-red-100 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Sl. No
                </th>
                <th scope="col" className="px-4 py-3">
                  Employee ID
                </th>
                <th scope="col" className="px-4 py-3">
                  Employee Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Department
                </th>
                <th scope="col" className="px-4 py-3">
                  Completed
                </th>
                <th scope="col" className="px-4 py-3">
                  Partial
                </th>
                <th scope="col" className="px-4 py-3">
                  Incomplete
                </th>

                <th scope="col" className="px-4 py-3 text-center">
                  Date
                </th>
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {mainData.data &&
                mainData?.data?.map((item: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 hover:cursor-pointer">
                      {item.employeeId.employeeId}
                    </td>
                    <td className="px-4 py-2">{item.employeeId.name}</td>
                    <td className="px-4 py-2 ">{item.employeeId.department}</td>
                    <td className="px-4 py-2 ">
                      {item.employeeId.TasksCompleted.completed}/
                      {item.employeeId.TasksCompleted.total}
                    </td>
                    <td className="px-4 py-2 ">
                      {item.employeeId.TasksCompleted.partial}/
                      {item.employeeId.TasksCompleted.total}
                    </td>
                    <td className="px-4 py-2 ">
                      {item.employeeId.TasksCompleted.incomplete}/
                      {item.employeeId.TasksCompleted.total}
                    </td>
                    {/* <td className="px-4 py-2">
                      {item.employeeId.TasksCompleted.incomplete +
                        item.employeeId.TasksCompleted.partial +
                        item.employeeId.TasksCompleted.completed}{' '}
                      /{item.employeeId.TasksCompleted.total}
                    </td> */}
                    <td className="px-4 py-2">
                      {`${item.DateAdded.split('-')[1]}-${
                        item.DateAdded.split('-')[2]
                      }-${item.DateAdded.split('-')[0]}`}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        to={`/dashboard/single-employee-update/${item.employeeId._id}/${item.employeeId.employeeId}`}
                      >
                        <button className="text-red-500 hover:underline">
                          ➡️
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewTask2;
