import { useState, useEffect, useRef } from "react";

const FinYear = ({ selectedYear, selectmonths, setSelectmonths ,autoFocusBuyer}) => {
  const [months, setMonths] = useState([]);
    const buyerRef = useRef(null);
  console.log("Selectedmonth1", selectmonths);

useEffect(() => {
  if (autoFocusBuyer && buyerRef.current) {
    buyerRef.current.focus();
  }
}, [autoFocusBuyer, selectmonths]);
  useEffect(() => {
    if (!selectedYear || typeof selectedYear !== "string") return;

    const [startStr, endStr] = selectedYear.split("-").map(Number);
    const startYear = 2000 + startStr;
    const endYear = 2000 + (endStr < startStr ? endStr + 100 : endStr);

    const monthNames = [
      "April", "May", "June", "July", "August", "September",
      "October", "November", "December", "January", "February", "March"
    ];

    const monthList = monthNames.map((month, index) => {
      const year = index < 9 ? startYear : endYear;
      return `${month} ${year}`;
    });

    setMonths(monthList);
  }, [selectedYear]);

  return (
    <div className="max-w-md mx-auto">
      <div>
        <select
         ref={buyerRef}   
          className="border-gray-300  p-1 w-32 h-6.5 text-gray-900 text-xs rounded-md  focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={selectmonths}
          onChange={(e) => setSelectmonths(e.target.value)}
        >
          <option value="">Select Month</option>
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FinYear;
