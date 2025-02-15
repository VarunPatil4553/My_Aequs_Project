// Function to sort the data array based on SortedUpdates
export function sortData(data: any, sortedUpdates: any) {
  // Create a map from the sortedUpdates for quick lookup
  const sortOrderMap = new Map();
  sortedUpdates.forEach((update: any, index: number) => {
    sortOrderMap.set(update.employeeId._id, index);
  });
  console.log('sortedUpdates', sortedUpdates);
  // Sort the data array based on the order in sortOrderMap
  data.sort((a: any, b: any) => {
    const aIndex = sortOrderMap.get(a.employeeId) || Infinity;
    const bIndex = sortOrderMap.get(b.employeeId) || Infinity;
    return aIndex - bIndex;
  });

  return [...data].reverse();
}

// Example Input
// const data = [
//   {
//     count: 5,
//     createdAt: '2024-10-16T19:07:57.021Z',
//     DateAdded: '2025-01-20',
//     employeeId: '6704e616f4b32d3c892734ec',
//     employeeInfo: {
//       _id: '6704e616f4b32d3c892734ec',
//       name: 'Nikhil',
//       email: 'nikhil@gmail.com',
//       employeeId: '1005',
//       TaskCompleted: {
//         completed: 2,
//         total: 5,
//         incomplete: 1,
//         partial: 2,
//       },
//       department: 'Shipping & Receiving',
//       __v: 0,
//     },
//   },
//   {
//     count: 5,
//     createdAt: '2024-10-16T19:07:57.021Z',
//     DateAdded: '2025-01-20',
//     employeeId: '6704e602f4b32d3c892734e7',
//     employeeInfo: {
//       _id: '6704e602f4b32d3c892734e7',
//       name: 'karthik',
//       email: 'kartik@gmail.com',
//       employeeId: '1004',
//       TaskCompleted: {
//         completed: 1,
//         total: 5,
//         incomplete: 1,
//         partial: 3,
//       },
//       department: 'Shipping & Receiving',
//       __v: 0,
//     },
//   },
// ];

// const sortedUpdates = [
//   {
//     _id: '678dc4b3a060336f9518a32d',
//     employeeId: {
//       _id: '6704e602f4b32d3c892734e7',
//       name: 'karthik',
//       employeeId: '1004',
//     },
//     slNo: 0,
//   },
//   {
//     _id: '678dc4cea060336f9518a34f',
//     employeeId: {
//       _id: '6704e616f4b32d3c892734ec',
//       name: 'Nikhil',
//       employeeId: '1005',
//     },
//     slNo: 1,
//   },
// ];

// Sort the data
// const sortedData = sortData(data, sortedUpdates);

// console.log(sortedData);
