import React, { useState, useEffect } from 'react';
import { useGetlongAbsentQuery } from '../../redux/service/misDashboardService';
import 'tailwindcss/tailwind.css';
import CardWrapper from '../../components/CardWrapper';
import BuyerMultiSelect4 from '../../components/ModelMultiSelect4';

const LongAbsent = () => {
  // Function to format date as DD/MM/YYYY for API
  const formatToDDMMYYYY = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to get January 1st of current year in YYYY-MM-DD format
  const getJanFirst = () => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-01-01`;
  };

  // Function to get today's date in YYYY-MM-DD format
  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [selected, setSelected] = useState();
  const [fromDate, setFromDate] = useState(getToday());
  const [toDate, setToDate] = useState(getToday());
  const [paycat, setPaycat] = useState('ALL');
  const [showModel, setShowModel] = useState(false);
  console.log(fromDate,"fromDate toDate",toDate)
 const { data: longAbsentData, error, isLoading, refetch } = useGetlongAbsentQuery({
  params: { 
    compCode: selected || "AGF", 
    docdate: formatToDDMMYYYY(fromDate),
    docdate1: formatToDDMMYYYY(toDate),
    payCat: paycat
  }
});
console.log(longAbsentData,"longAbsentData")


  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort data if needed
  const sortedData = React.useMemo(() => {
    if (!longAbsentData?.data) return [];

    let sortableItems = [...longAbsentData.data];
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
  }, [longAbsentData, sortConfig]);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <>
      <CardWrapper heading={"Long Absent Employees"} showFilter={true} onFilterClick={() => setShowModel(true)}>
        {showModel && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end z-50">
            <div className="w-full sm:w-[500px] bg-white rounded-t-2xl shadow-lg p-4 animate-slide-up">
              <BuyerMultiSelect4
                selected={selected}
                setSelected={setSelected}
                showModel={showModel}
                setShowModel={setShowModel}
              />
            </div>
          </div>
        )}

        {/* Date and Pay Category Filters */}
        <div className="flex flex-wrap gap-4 mb-4 p-2 bg-gray-50 rounded-md">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="p-2 border rounded-md text-sm"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="p-2 border rounded-md text-sm"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Pay Category</label>
            <select
              value={paycat}
              onChange={(e) => setPaycat(e.target.value)}
              className="p-2 border rounded-md text-sm"
            >
              <option value="ALL">All</option>
              <option value="STAFF">Staff</option>
              <option value="LABOUR">Labour</option>
            </select>
          </div>
        </div>

        <div className="h-[350px] bg-white rounded-lg shadow-md mt-2 p-1">
          <div className="overflow-x-auto h-full">
            <table className="min-w-full bg-white border border-gray-200 text-xs">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('empId')}
                  >
                    Employee ID {sortConfig.key === 'empId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('empName')}
                  >
                    Name {sortConfig.key === 'empName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('absentDays')}
                  >
                    Absent Days {sortConfig.key === 'absentDays' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('lastAttendance')}
                  >
                    Last Attendance {sortConfig.key === 'lastAttendance' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('department')}
                  >
                    Department {sortConfig.key === 'department' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('paycat')}
                  >
                    Pay Category {sortConfig.key === 'paycat' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-1 px-2 border text-gray-700">{item.empId}</td>
                    <td className="py-1 px-2 border font-medium text-gray-700">{item.empName}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.absentDays}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.lastAttendance}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.department}</td>
                    <td className="py-1 px-2 border text-gray-700">{item.paycat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedData.length === 0 && (
            <div className="text-center py-4 text-black text-xs">
              No long absent data available
            </div>
          )}
        </div>
      </CardWrapper>
    </>
  );
};

export default LongAbsent;