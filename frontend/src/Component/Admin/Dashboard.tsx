import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Function to confirm logout (redirect to homepage)
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    window.location.href = '/'; // Redirect to home after logout
  };

  // Function to cancel logout (close modal)
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };
  useEffect(() => {
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
  return (
    <div className="">
      {/* Navbar */}
      <nav className="text-black fixed w-full z-10 transition-colors duration-300 bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold font-serif">
            <Link to="/dashboard">
              <img
                className="w-60 h-30"
                src="https://www.aequs.com/wp-content/uploads/2021/06/Aequs-Logo-new.png"
                alt="aques-symbol"
              />
            </Link>
          </div>
          {/* <div className="flex space-x-4">
            <Link to="/dashboard">Admin DashBoard</Link>
          </div> */}
        </div>
      </nav>

      {/* Sidebar with outlet */}
      <div className="flex">
        <div className="w-1/6 bg-black min-h-screen h-full fixed top-10 pt-20 border border-black">
          <div className="p-4">
            <h1 className="text-white text-2xl font-serif">
              {/* {greeting} */} Admin...
            </h1>
            <ul className="mt-4 space-y-4">
              {/* Sidebar Links */}
              <li className="text-white font-serif">
                <Link to="">Dashboard</Link>
              </li>
              <li className="text-white font-serif">
                <Link to="/dashboard/add-department">Departments</Link>
              </li>
              <li className="text-white font-serif">
                <Link to="addemployee">Add Employee</Link>
              </li>
              <li className="text-white font-serif">
                <Link to="viewemployee">View Employee</Link>
              </li>
              <li className="text-white font-serif">
                <Link to="addtask">Add Task</Link>
              </li>
              <li className="text-white font-serif">
                <Link to="viewtask">View Task</Link>
              </li>
              <li className="text-white font-serif">
                <Link to="/dashboard/employee-updated-tasks">
                  Task Completion Summary
                </Link>
              </li>
              <li className="text-white font-serif">
                {/* Trigger logout modal */}
                <button onClick={handleLogoutClick} className="text-white">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-screen bg-gray-50 min-h-screen mt-20 pl-[16.67%]">
          {/* 1/6 = ~16.67% */}
          <div className="min-h-full">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-20">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleConfirmLogout}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={handleCancelLogout}
              >
                No
              </button>
            </div>
          </div>

          {/* Blurred and dimmed background */}
          <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-md z-10"></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
