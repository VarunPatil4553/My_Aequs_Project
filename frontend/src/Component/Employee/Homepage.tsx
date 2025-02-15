import React from 'react';

import Navbar from '../Navbar/Navbar';

const Homepage: React.FC = () => {
  const profiles = JSON.parse(localStorage.getItem('employee') || 'null');

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

  return (
    <div>
      {/* Navbar for Employee Tracking System with Sign-in/Sign-up */}
      <Navbar
        profileData={{ Eid: profile.employeeId, imageUrl: profile.imageUrl }}
      />

      {/* <div className="w-screen h-screen">
        <img
          src="https://www.scnsoft.com/_default_upload_bucket/employee-monitoring-software.png"
          alt="Employee Tracking System"
          className="object-cover w-screen h-screen"
        />
      </div> */}

      {/* component */}
      <div className=" grid grid-cols-3 w-screen h-[80%] gap-2 relative ">
        <div className="col-span-1 bg-white  p-2 ml-5 relative top-44  transform ease-in-out translate-x-2  ">
          <img
            src="https://www.binaryfolks.com/media/blog/Employee%20monitoring%20software/intro.png"
            alt="Employee Tracking System"
            className=" h-[500px]  "
          />
          <div className="">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
              ratione accusamus harum officiis voluptatum non vitae doloribus
              laborum! Molestias, itaque laboriosam voluptas enim est vel libero
              quasi tempora architecto provident.
            </p>
          </div>
        </div>
        <div className="col-span-1 bg-white relative top-20">
          <img
            src="https://flowace.ai/wp-content/uploads/2023/10/posgra.jpg"
            alt="Employee Tracking System"
            className="h-[500px]"
          />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta,
            minima. Totam laborum earum libero iure culpa beatae architecto,
            placeat fugiat laboriosam quod accusamus, doloremque voluptas,
            delectus maxime perferendis distinctio quibusdam?
          </p>
        </div>
        <div className="col-span-1 bg-white  p-2 ml-5 relative top-44 ">
          <img
            src="https://www.softactivity.com/wp-content/uploads/Benefits-and-Pitfalls-of-Deploying-Employee-Monitoring-Software.jpg"
            alt="Employee Tracking System"
            className=" h-[500px]  "
          />
          <div className="">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
              ratione accusamus harum officiis voluptatum non vitae doloribus
              laborum! Molestias, itaque laboriosam voluptas enim est vel libero
              quasi tempora architecto provident.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-red-500 text-white p-4 mt-44">
        <div className="container mx-auto">
          <div className="text-center">
            <p>Employee Tracking System @2020</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
