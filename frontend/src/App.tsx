import React from 'react';
// import Home from './Component/Home/Home';
import Login from './Component/Home/Login';
import Dashboard from './Component/Admin/Dashboard';
import AddEmployee from './Component/Admin/AddEmployee';
import ViewEmployee from './Component/Admin/ViewEmployee';
import AddTask from './Component/Admin/AddTask';
import ViewTask from './Component/Admin/ViewTask';
import Homepage from './Component/Employee/Homepage';
import ViewTasks from './Component/Employee/ViewTask';
import EditEmployee from './Component/Admin/EditEmployee';
import ProfileView from './Component/Employee/ProfileView';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditTask from './Component/Admin/EditTask';
import Maindashboard from './Component/Admin/Maindashboard';
import ViewTask2 from './Component/Admin/TaskSummary';

import CheckSingleEmployeeUpdate from './Component/Admin/checkSingleEmployeeUpdate';
import AddDepratment from './Component/Admin/AddDepratment';

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route
            path="/"
            element={
              <>
                <Login />
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="add-department" element={<AddDepratment />} />
            <Route path="" element={<Maindashboard />} />
            <Route path="addemployee" element={<AddEmployee />} />
            <Route path="viewemployee" element={<ViewEmployee />} />
            <Route path="addtask" element={<AddTask />} />
            <Route path="viewtask" element={<ViewTask />} />
            <Route path="editemployee/:id" element={<EditEmployee />} />
            <Route path="edittask/:id" element={<EditTask />} />
            <Route
              path="employee-updated-tasks"
              element={<ViewTask2 />}
            ></Route>
            <Route
              path="single-employee-update/:id/:id2"
              element={<CheckSingleEmployeeUpdate />}
            ></Route>
          </Route>
          <Route path="/employee" element={<Homepage />} />
          <Route path="/viewtasks" element={<ViewTasks />} />
          <Route path="/profile" element={<ProfileView />} />
        </Routes>
        <ToastContainer />
      </Router>
    </div>
  );
};

export default App;
