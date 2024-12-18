import React, { useState } from "react";
import lab from "../assets/img/image.png";
import staff from "../assets/businessman.png";
import money from "../assets/img/money.png";
import worker from "../assets/img/layout/labour-day.png";
import staffs from "../assets/img/layout/bussines.png";
import totalIcon from "../assets/img/layout/all.png";
import male from "../assets/man.png";
import female from "../assets/human.png";
import { ColorContext } from "../scenes/global/context/ColorContext";
import { useContext } from "react";


const NumericCard = ({ misData, selectedBuyer }) => {
  const totalTurnOver = misData?.data?.totalTurnOver || [];
  const profit = misData?.data?.profit || [];
  const newCustomers = misData?.data?.newCustomers || [];
  const topCustomers = misData?.data?.topCustomers || [];
  const loss = misData?.data?.loss || [];
  const { color } = useContext(ColorContext); 

  const filteredTotalTurnOver = totalTurnOver.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filterProfit = profit.filter((item) => selectedBuyer.includes(item.comCode));
  const filterNewCus = newCustomers.filter((item) => selectedBuyer.includes(item.comCode));
  const filteredTopCus = topCustomers.filter((item) => selectedBuyer.includes(item.comCode));
  const filterLoss = loss.filter((item) => selectedBuyer.includes(item.comCode));

  const data = [
    {
      heading: "Employees on Role",
      borderColor: "#1F588B",
      value: filteredTotalTurnOver.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: filteredTotalTurnOver.reduce((acc, item) => acc + item.prevValue, 0),
      icon: lab,
    },
    {
      heading: "Avg Monthly Salary",
      borderColor: "#62AAA3",
      value: filterProfit.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: filterProfit.reduce((acc, item) => acc + item.prevValue, 0),
      icon: staff,
    },
    {
      heading: "Last Month Salary",
      borderColor: "#96A669",
      value: filterNewCus.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: filterNewCus.reduce((acc, item) => acc + item.prevValue, 0),
      icon: money,
    },
    {
      heading: "Staff Last Month Salary",
      borderColor: "#D49B37",
      value: filteredTopCus.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: filteredTopCus.reduce((acc, item) => acc + item.prevValue, 0),
      icon: staffs,
    },
    {
      heading: "Labours Last Month Salary",
      borderColor: "#F4A300",
      value: filterLoss.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: filterLoss.reduce((acc, item) => acc + item.prevValue, 0),
      icon: worker,
    },
  ];

  const [activeTabs, setActiveTabs] = useState(data.map(() => "total"));

  const toggleTab = (index, tab) => {
    const newTabs = [...activeTabs];
    newTabs[index] = tab;
    setActiveTabs(newTabs);
  };
  console.log(color,"color1234")

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 bg-gradient-to-br from-[#1e293b] to-[#374151]">
      {data.map((val, i) => (
        <div
          key={i}
          className="relative rounded-lg shadow-md bg-gradient-to-tr from-white to-gray-100 transform hover:scale-105 hover:shadow-lg transition-all duration-300 p-3"
        >
         <div
  className={`absolute -top-2 -right-1 w-14 h-14 rounded-full flex items-center justify-center 
   shadow-md`}
   style={{
    border: `2px solid ${val.borderColor}`,
    background: color 
      ? color 
      : 'linear-gradient(to top right, #FFD700, #F4A300)',
  }}
  >
  <img
    src={
      activeTabs[i] === "total"
        ? totalIcon
        : activeTabs[i] === "previousValue"
        ? male
        : female
    }
    alt="icon"
    className="w-10 h-10"
  />
</div>


          <div className="text-center mt-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{val.heading}</h2>
            <p className="text-2xl font-bold text-[#CA8A04] mb-1"   style={{
    color: color 
      ? color 
      : 'linear-gradient(to top right, #FFD700, #F4A300)',
  }}>
              {activeTabs[i] === "total"
                ? (val.value + val.previousValue).toLocaleString()
                : activeTabs[i] === "previousValue "
                ? val.previousValue.toLocaleString()
                : val.value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              {activeTabs[i] === "total"
                ? "Total Value"
                : activeTabs[i] === "previousValue"
                ? "Male Detail"
                : "Female Detail"}
            </p>
          </div>

          <div className="flex justify-between mt-2">
          <button
  onClick={() => toggleTab(i, "total")}
  className={`w-1/3 px-1 py-1 rounded-l-full text-xs font-medium shadow-md transition ${
    activeTabs[i] === "total" ? "text-white" : "bg-gray-200 text-gray-700 hover:bg-[#232E3F] hover:text-white"
  }`}
  style={
    activeTabs[i] === "total"
      ? { backgroundColor: color || "#CA8A04" }
      : {}
  }
>
  Total
</button>
            <button
              onClick={() => toggleTab(i, "previousValue")}
              className={`w-1/3 px-1 py-1 text-xs font-medium shadow-md transition ${
                activeTabs[i] === "previousValue"
                  ? "bg-[#CA8A04] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-[#232E3F] hover:text-white"
              }`}
              style={
                activeTabs[i] === "previousValue"
                  ? { backgroundColor: color || "#CA8A04" }
                  : {}
              }
            >
              Male
            </button>
            <button
              onClick={() => toggleTab(i, "value")}
              className={`w-1/3 px-1 py-1 rounded-r-full text-xs font-medium shadow-md transition ${
                activeTabs[i] === "value"
                  ? "bg-[#CA8A04] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-[#232E3F] hover:text-white"
              }`}
              style={
                activeTabs[i] === "value"
                  ? { backgroundColor: color || "#CA8A04" }
                  : {}
              }
            >
              Female
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NumericCard;
