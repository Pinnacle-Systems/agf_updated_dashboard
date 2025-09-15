import React, { useState } from 'react';
import { useGetLeaveAvbQuery } from '../../redux/service/misDashboardService';
import 'tailwindcss/tailwind.css';
import CardWrapper1 from '../../components/CardWrapper';

const LeaveAvailable = () => {
  const { data: leaveAvb, error, isLoading } = useGetLeaveAvbQuery({ 
    params: { compCode: "AGF", filterYear: 2025 } 
  });
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  // Function to handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Sort data if needed
  const sortedData = React.useMemo(() => {
    if (!leaveAvb?.data) return [];
    
    let sortableItems = [...leaveAvb.data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [leaveAvb, sortConfig]);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
                    <CardWrapper1 heading={"Leave Availability"} showFilter={true}   >
      <div className="bg-white rounded-lg shadow-md p-6">
       
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th 
                  className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('mid')}
                >
                  ID Card {sortConfig.key === 'mid' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th 
                  className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('fname')}
                >
                  Name {sortConfig.key === 'fname' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th 
                  className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lcode')}
                >
                  Leave Code {sortConfig.key === 'lcode' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Description
                </th>
                <th 
                  className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lbal')}
                >
                  Leave Balance {sortConfig.key === 'lbal' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th 
                  className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lt')}
                >
                  Leave Taken {sortConfig.key === 'lt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th 
                  className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('Avl')}
                >
                  Available Leave {sortConfig.key === 'Avl' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th 
                  className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('paycat')}
                >
                  Pay Category {sortConfig.key === 'paycat' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.mid}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.fname}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.lcode}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.ldesc}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.lbal}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.lt}</td>
                  <td className="py-3 px-4 text-sm font-medium text-green-600">{item.Avl}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{item.paycat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No leave data available
          </div>
        )}
      </div>
    </CardWrapper1>
  );
};

export default LeaveAvailable;