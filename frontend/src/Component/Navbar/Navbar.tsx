import { Link, useNavigate } from 'react-router-dom';

import DateTimeDisplay from './DateAndTime';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthContext/AuthContextProvider';
function Navbar({
  profileData,
}: {
  profileData: { Eid?: string; imageUrl?: string };
}) {
  const [token, SetToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const value = useContext(AuthContext) as {
    employeeLogged: any;
    setEmployeeLogged: any;
  };
  const handleLogout = () => {
    // Perform logout actions here
    localStorage.removeItem('employee');
    value.setEmployeeLogged('');
    navigate('/');
  };
  useEffect(() => {
    if (token && token.length > 0) {
      navigate('/viewtasks');
      return;
    }
    //handleLogout();
    //navigate('/');
  }, []);
  return (
    <div>
      <nav
        className={`bg-white text-black p-1 fixed w-full z-10 transition-colors duration-300`}
      >
        <div className="container mx-auto mb-2 flex justify-between items-center ">
          <div className={` text-xl font-bold font-serif`}>
            <Link to="/">
              <img
                className="w-60 h-30"
                src="https://www.aequs.com/wp-content/uploads/2021/06/Aequs-Logo-new.png"
                alt="aques.sympol"
              />
            </Link>
          </div>
          <div className="flex space-x-4 items-center">
            <Link
              to="/viewtasks"
              className={`text-black  px-3 py-2 rounded font-serif`}
            >
              <div>
                <div>Id - {profileData.Eid}</div>

                <div>
                  <DateTimeDisplay />
                </div>
              </div>
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded font-serif broder border-black flex items-center bg-white`}
            >
              {/* <img
                src={`${BASE_URL}/uploads/employees/${profileData.imageUrl}`}
                alt=""
                className=" rounded-full w-10 h-10"
              /> */}
              <div>Profile</div>
            </Link>
            <button
              type="button"
              className="h-9 w-20 rounded bg-gray-900 text-white"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Are you sure you want to logout?
            </h3>
            <div className="mt-6 flex justify-between">
              <button
                className="w-24 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                className="w-24 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
                onClick={() => setShowLogoutConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
