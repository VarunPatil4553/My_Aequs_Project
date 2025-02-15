import { AxiosAPI } from '../../AxiosApi';
import { useState } from 'react';
import { useEffect } from 'react';

import { toast } from 'react-toastify';

const Maindashboard = () => {
  const [data, setData] = useState<number>(0);
  const [data2, setdata2] = useState<number>(0);
  const [data3, setdata3] = useState<number>(0);

  console.log(data);
  console.log(data2);
  console.log(data3);

  const gettingdata = async () => {
    try {
      const response = await AxiosAPI.get('/admin/dashboard');
      console.log(response);
      setData(response.data.data);
      setdata2(response.data.tasks);
      setdata3(response.data.completedtask);
    } catch (error) {
      console.log(error);
      toast.error('Some Went Wroung try After Some times');
    }
  };

  useEffect(() => {
    gettingdata();
  }, []);

  return (
    <div className="mt-12">
      <h5 className="ml-4 mb-5 text-2xl text-red-500 font-serif">Dashboard</h5>
      {/* grid in colom 3  */}
      <div className="flex bg-gray-100 h-[300px] border-t-8 ml-2 border-t-red-300 border-b-8 border-b-red-300 mr-5 justify-center">
        <div className=" border w-36 h-20 justify-center items-center mt-20 ml-6 rounded-md bg-white">
          <h1 className="text-center mt-3">Total Employees</h1>
          <h5 className=" text-center mt-2">{data}</h5>
        </div>
        <div className=" border w-36 h-20 justify-center items-center mt-20 ml-6 rounded-md bg-white">
          <h1 className="text-center mt-3">Total Tasks</h1>
          <h5 className=" text-center mt-2">{data2}</h5>
        </div>{' '}
        {/* <div className=" border w-36 h-20 justify-center items-center mt-20 ml-6 rounded-md bg-white">
          <h1 className="text-center mt-3"> Completed Task</h1>
          <h5 className=" text-center mt-2">{data3}</h5>
        </div>{' '} */}
      </div>
    </div>
  );
};

export default Maindashboard;
