import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AxiosAPI } from '../../AxiosApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContextProvider';

const getDepartments = async () => {
  try {
    const getDepts = await AxiosAPI.get('/admin/get-departments');
    console.log(getDepts.data.data);
    return getDepts.data.data;
  } catch (er: any) {
    console.log(er.message);
  }
};
const Login: React.FC = () => {
  const [token, SetToken] = useState(localStorage.getItem('employee') || '');
  const navigate = useNavigate();

  const value = useContext(AuthContext) as {
    Name: string;
    isLoggedAdmin: boolean;
    employeeLogged: any;
  };
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [departmentState, setDepartment] = useState<
    { Name: string; _id: string }[]
  >([]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (data.email === 'admin@gmail.com' || data.password === 'admin') {
        const res = await AxiosAPI.post('admin/login', data);

        console.log(res.data);

        localStorage.setItem('admin', JSON.stringify(res.data));
        toast.success('Login Success');
        navigate('/dashboard');
      } else {
        const res = await AxiosAPI.post('employee/login', data);
        console.log(res.data);
        localStorage.setItem('employee', JSON.stringify(res.data.data));
        toast.success('Login Success');
        navigate('/viewtasks');
      }
    } catch (error) {
      console.log(error);
      toast.error('Invalid Credentials');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/viewtasks');
      return;
    }
    const depts = async () => {
      try {
        const departs = await getDepartments();
        console.log('Dept: ', departs);
        setDepartment([...departs]);
      } catch (er: any) {
        console.log('inside effect', er.message);
      }
    };
    depts();
  }, []);
  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div>
      {/* Navbar */}

      <nav
        className={`p-4 fixed w-full z-10 transition-colors duration-300 bg-white text-black`}
      >
        <div className="container mx-auto flex justify-between items-center ">
          <div className={`text-black text-2xl font-bold font-serif`}>
            <img
              className="w-60 h-30"
              src="https://www.aequs.com/wp-content/uploads/2021/06/Aequs-Logo-new.png"
              alt="aques-symbol"
            />
          </div>
          {/* <div className="flex space-x-4 text-black">
            <Link
              to="/signin"
              className={`text-black  px-3 py-2 rounded font-serif`}
            >
              Sign In
            </Link>
          </div> */}
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex justify-center items-center h-screen">
        {/* <div className="">
             <img src="https://salesfokuz.com/uploads/1654854450874.webp" alt="" className=''/>
          </div> */}
        <div className="w-96 p-6 bg-gray-100 rounded-lg shadow-lg">
          <label
            htmlFor="empID"
            className="block text-sm font-medium text-black"
          >
            Employee ID
          </label>
          <input
            type="number"
            name="employeeId"
            className="w-full px-4 py-2 mt-2 border rounded-lg outline-none text-black"
            onChange={handleChange}
          />
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <select
            name="department"
            className="w-full px-4 py-2 mt-2 border rounded-lg outline-none"
            onChange={handleChange}
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
            {/* <option value="">Choose Department</option>
            <option value="Quality">Quality</option> */}
            {/* <option value="Bay 1">Bay 1</option>
            <option value="Bay 2">Bay 2</option>
            <option value="Bay 3">Bay 3</option> */}
            {/* <option value="Shipping & Receiving">Shipping & Receiving</option> */}
            {/* <option value="Assembly">Assembly</option> */}
            {/* <option value="Warehouse">Warehouse</option> */}
          </select>
          <h2 className="text-xl font-semibold text-center text-gray-800">
            OR
          </h2>
          <h2 className="text-lg font-semibold text-center text-gray-800">
            Sign In Admin
          </h2>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 mt-2 border rounded-lg outline-none"
                onChange={handleChange}
              />

              <label
                htmlFor="password"
                className="block mt-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 mt-2 border rounded-lg outline-none"
                onChange={handleChange}
              />

              {/* button */}
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-blue-600 rounded-lg text-white text-semibold"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
