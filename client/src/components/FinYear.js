import { useState, useEffect } from "react";

const FinYear = ({ selectedYear, selectmonths, setSelectmonths }) => {
  const [months, setMonths] = useState([]);

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
          className="border-gray-400 rounded p-1 w-full text-gray-500 text-sm"
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
