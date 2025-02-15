import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animated } from '@react-spring/web';

const Home: React.FC = () => {
  const [navBg, setNavBg] = useState('bg-inherit');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavBg('bg-gradient-to-r from-violet-500 to-fuchsia-500');
      } else {
        setNavBg('bg-inherit');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [navBg1, setNavBg1] = useState('text-black');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavBg1('text-white');
      } else {
        setNavBg1('text-black');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Navbar for Employee Tracking System with Sign-in/Sign-up */}
      <nav
        className={`${navBg} p-4 fixed w-full z-10 transition-colors duration-300`}
      >
        <div className="container mx-auto flex justify-between items-center ">
          <div className={`${navBg1} text-2xl font-bold font-serif`}>
            <Link to="/">
              <img
                className="w-60 h-30"
                src="https://www.aequs.com/wp-content/uploads/2021/06/Aequs-Logo-new.png"
                alt="aques-symbol"
              />
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/signin"
              className={`${navBg1}  px-3 py-2 rounded font-serif`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="w-screen h-screen items-center">
        <img
          src="https://www.scnsoft.com/_default_upload_bucket/employee-monitoring-software.png"
          alt="Employee Tracking System"
          className="object-cover w-screen h-screen"
        />
      </div>

      {/* component */}
      <div className=" grid grid-cols-3 w-screen h-[80%] gap-2 relative ">
        <animated.div
          className={`col-span-1 bg-white  p-2 ml-5 relative top-44 `}
        >
          <img
            src="https://www.binaryfolks.com/media/blog/Employee%20monitoring%20software/intro.png"
            alt="Employee Tracking System"
            className=" h-[500px]  "
          />
          <div className=" text-justify">
            <p>
              An Employee Tracking System is a robust software solution designed
              to monitor and manage employee activities within an organization.
              It allows employers to track attendance, work hours, productivity,
              and project progress in real-time. The system automates the
              tracking process, reducing manual errors and ensuring accurate
              data collection. By integrating with existing HR and project
              management tools, it provides a seamless way to oversee and
              optimize workforce performance.
            </p>
          </div>
        </animated.div>
        <div className="col-span-1 bg-white relative top-20">
          <img
            src="https://flowace.ai/wp-content/uploads/2023/10/posgra.jpg"
            alt="Employee Tracking System"
            className="h-[500px]"
          />
          <p className="text-justify">
            This system offers detailed insights into employee behavior and
            productivity, allowing managers to identify patterns, allocate
            resources effectively, and address any inefficiencies. Features like
            GPS tracking, task monitoring, and automated reporting enable
            companies to ensure that employees are meeting their objectives
            while maintaining transparency and accountability. By providing
            real-time data, the system helps in making informed decisions that
            align with organizational goals.
          </p>
        </div>
        <div className="col-span-1 bg-white  p-2 ml-5 relative top-44 ">
          <img
            src="https://www.softactivity.com/wp-content/uploads/Benefits-and-Pitfalls-of-Deploying-Employee-Monitoring-Software.jpg"
            alt="Employee Tracking System"
            className=" h-[500px]  "
          />
          <div className=" text-justify">
            <p>
              Moreover, an Employee Tracking System promotes a culture of trust
              and responsibility within the workplace. It empowers employees by
              offering clear expectations and measurable performance metrics,
              fostering a more organized and motivated workforce. The system
              also supports remote work arrangements by offering flexible
              tracking options that ensure all employees, regardless of
              location, remain connected and productive. Overall, it enhances
              operational efficiency and contributes to achieving business
              success.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-red-500 text-white p-4 mt-44">
        <div className="container mx-auto">
          <div className="text-center">
            <p>Employee Tracking System @2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
