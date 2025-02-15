import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useContext, useState } from 'react';
import { AuthContext } from '../../AuthContext/AuthContextProvider';

const ProfileView = () => {
  // Dummy data
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const profiles = JSON.parse(localStorage.getItem('employee') || 'null');
  const value = useContext(AuthContext) as {
    employeeLogged: any;
    setEmployeeLogged: any;
  };
  console.log(profiles);
  const navigate = useNavigate();
  const profile = {
    name: profiles.name,
    email: profiles.email,
    phone: profiles.phone,
    address: profiles.address,
    employeeId: profiles.employeeId,
    department: profiles.department,
    designation: profiles.designation,
    salary: profiles.salary,
    imageUrl: profiles.profile,
  };
  const handleLogout = () => {
    // Perform logout actions here
    localStorage.removeItem('employee');
    value.setEmployeeLogged('');
    navigate('/');
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${'https://png.pngtree.com/thumb_back/fh260/background/20220322/pngtree-background-biru-keren-dan-kosong-abstract-untuk-template-desain-powerpoint-ppt-image_1067979.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Navbar
          profileData={{ Eid: profile.employeeId, imageUrl: profile.imageUrl }}
        />

        <div className="max-w-lg mx-auto  w-[500px] absolute top-40 left-1/3  p-6 bg-white shadow-lg rounded-lg ">
          <div className="flex justify-center mb-6 ">
            {/* <img
            src={`${BASE_URL}/uploads/employees/${profile.imageUrl}`}
            alt="Profile"
            className="w-32 h-32 rounded-full shadow-md"
          /> */}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Profile Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium">Name</label>
              <p className="text-gray-800">{profile.name}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <p className="text-gray-800">{profile.email}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Employee ID
              </label>
              <p className="text-gray-800">{profile.employeeId}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Department
              </label>
              <p className="text-gray-800">{profile.department}</p>
            </div>
            <div>
              <button
                type="button"
                className="h-9 w-20 rounded bg-gray-900 text-white"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                Are you sure you want to logout?
              </h3>
              <div className="mt-6 flex justify-between">
                <button
                  className="w-24 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
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
    </>
  );
};

export default ProfileView;
