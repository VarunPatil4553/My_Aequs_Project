import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosAPI } from '../../AxiosApi';

// import { compile } from '@fileforge/react-print';

interface Employee {
  department: string;
  email: string;
  employeeId: string;
  name: string;
  __v: number;
  _id: string;
}

interface Solution {
  comment: string;
  DateAdded: string;
  employee: Employee;
  _id: string;
  entryNumber: number;
}

interface TaskEach {
  category: string;
  createdAt: string;
  deadline: string;
  department: string;
  description: string;
  solutions: Solution[];
  status: string;
  task: string;
  __v: number;
  _id: string;
}

interface EmployeeData {
  name: string;
  department: string;
  count: number;
  employeeId: string;
  comment: string;
  Date: string;
  Category: string[];
}

function CheckSingleEmployeeUpdate() {
  const refComponent = useRef<HTMLDivElement | null>(null);
  const { id, id2 } = useParams();
  const [data, setData] = useState<TaskEach[]>([]);
  const [loader, setLoader] = useState(false);

  const handlePrint = () => {
    console.log('handlePrint function called');

    // Get the content of the component from the ref
    const content = refComponent.current?.innerHTML;

    if (!content) {
      console.error('No content to print');
      return;
    }

    console.log('Content to print:', content);

    // Create a new iframe element
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    console.log('Iframe created and appended to body');

    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) {
      console.error('Failed to get iframe window');
      document.body.removeChild(iframe);
      return;
    }

    const doc = iframeWindow.document;
    if (!doc) {
      console.error('Failed to get iframe document');
      document.body.removeChild(iframe);
      return;
    }

    console.log('Writing content to iframe');

    // Write the content into the iframe
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <title>Print Component</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            h1 {
              color: #333;
            }
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    doc.close();

    console.log('Content written to iframe, waiting for load');

    // Wait for the iframe to load and then trigger the print dialog
    iframe.onload = () => {
      console.log('Iframe loaded, attempting to print');
      setTimeout(() => {
        try {
          iframeWindow.focus(); // Ensure the iframe window has focus
          iframeWindow.print();
          console.log('Print dialog opened');
        } catch (error) {
          console.error('Failed to print:', error);
        } finally {
          setTimeout(() => {
            document.body.removeChild(iframe);
            console.log('Iframe removed');
          }, 100); // Short delay before removing iframe
        }
      }, 500); // Delay to ensure content is fully loaded
    };
  };

  const [EmpDetails, SetEmpDetails] = useState<EmployeeData>({
    name: '',
    department: '',
    count: 0,
    employeeId: '',
    comment: '',
    Date: new Date().toLocaleDateString('en-US'),
    Category: [],
  });

  const getUpdatesSingleEmp = async () => {
    try {
      setLoader(true);
      const response = await AxiosAPI.get(
        `admin/get-task-update-of-single-user/${id}/${id2}`
      );

      setLoader(false);
      setData(response.data.data);
      console.log(response.data.entryNumber);
      const NameEmp = response.data.data[0]?.solutions.filter(
        (ele: Solution) => ele.entryNumber == response.data.entryNumber
      )[0];

      const categories = [...new Set(data.map((task) => task.category))];

      SetEmpDetails({
        name: response.data.name,
        count: response.data.count,
        department: response.data.department,
        employeeId: response.data.employeeId,
        comment: NameEmp?.comment || '',
        Date: NameEmp?.DateAdded || '',
        Category: categories,
      });
    } catch (er) {
      setLoader(false);
      console.error(er instanceof Error ? er.message : 'Something went wrong');
    }
  };

  useEffect(() => {
    getUpdatesSingleEmp();
  }, []);

  return (
    <div className="mt-10">
      {loader && <h1 className="text-center">Loading...</h1>}
      {data.length === 0 && !loader && (
        <h1 className="text-center">No data found</h1>
      )}

      <div ref={refComponent}>
        {EmpDetails.name && (
          <div className="flex items-start">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mb-5 mr-10 flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Employee Info
              </h2>
              <div className="mb-4">
                <span className="text-gray-500">Name:</span>
                <span className="text-gray-800 ml-2">{EmpDetails.name}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-500">Department:</span>
                <span className="text-gray-800 ml-2">
                  {EmpDetails.department}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-gray-500">Employee ID:</span>
                <span className="text-gray-800 ml-2">
                  {EmpDetails.employeeId}
                </span>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mb-10 flex-1">
                  <div className="mb-4">
                    <span className="text-gray-500">Date Updated:</span>
                    <span className="text-gray-800 ml-2">
                      {new Date(EmpDetails.Date).toLocaleDateString('en-US')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Comment:</span>
                    <span className="text-gray-800 ml-2">
                      {EmpDetails.comment}
                    </span>
                  </div>
                </div>
                <button
                  className="p-3 m-1 bg-orange-500 text-white h8 rounded"
                  onClick={handlePrint}
                >
                  🖨️ Print
                </button>
              </div>
            </div>
          </div>
        )}
        <section className="container font-mono min-h-screen">
          <div className="w-full mb-8 rounded-lg shadow-lg bg-white">
            <div className="w-full">
              <table className="w-full table-auto justify-between">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((task, index) => {
                    const categoryName = task.category;
                    let showCategory =
                      index === 0 || task.category !== data[index - 1].category;

                    return (
                      <React.Fragment key={task._id}>
                        {showCategory && (
                          <tr className="bg-red-300 font-bold text-lg">
                            <td colSpan={2} className="px-4 py-2">
                              {categoryName}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t border-gray-200">
                          <td className="px-4 py-2 w-2/6">
                            <div className="flex items-center text-sm">
                              <div>
                                {/* 

                                 */}
                                <p className="font-semibold text-black">
                                  {task.task}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 w-3/6">
                            <p
                              className={`text-xs text-gray-600 ${
                                task.status == 'Completed'
                                  ? 'text-green-600'
                                  : task.status == 'Incomplete'
                                  ? 'text-red-600'
                                  : 'text-yellow-600'
                              }`}
                            >
                              {task.status}
                            </p>
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
    </div>
  );
}

export default CheckSingleEmployeeUpdate;
