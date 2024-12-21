import React, { useState, useContext } from "react";
import lab from "../assets/img/image.png";
import staff from "../assets/businessman.png";
import money from "../assets/img/money.png";
import worker from "../assets/img/layout/labour-day.png";
import { ColorContext } from "../scenes/global/context/ColorContext";
import './ToggleSwitch.css';
import './Model.css';
import ModelMultiSelect from "./ModelMultiSelect";
  const NumericCard = ({ misData, selectedBuyer,
    setSelectedBuyer,
  
   }) => {
    console.log(selectedBuyer,"selectedBuyerfor Nc")
  const totalTurnOver = misData?.data?.totalTurnOver || [];
  const totalTurnOver1 = misData?.data?.totalTurnOver1 || [];
  const [isOn, setIsOn] = useState(false);
  const profit = misData?.data?.profit || [];
  const profit1 = misData?.data?.profit1 || [];
  const [selectedState, setSelectedState] = useState("");

  const newCustomers = misData?.data?.newCustomers || [];
  const topCustomers = misData?.data?.topCustomers || [];
  const loss = misData?.data?.loss || [];
  const loss01 = misData?.data?.loss01 || [];

  const loss1 = misData?.data?.loss1 || [];
  const loss11 = misData?.data?.loss11 || [];

  const { color } = useContext(ColorContext);

  const filteredTotalTurnOver = totalTurnOver.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filteredTotalTurnOver1 = totalTurnOver1.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filterNewCus = newCustomers.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filteredTopCus = topCustomers.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  console.log(isOn,"isOn")
  const filterLoss = loss.filter((item) => selectedBuyer.includes(item.comCode));
  const filterLoss01 = loss01.filter((item) => selectedBuyer.includes(item.comCode));
  const filterLoss1 = loss1.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filterLoss11 = loss11.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );  

  const data = [
    {
      heading: "Employees on Roll",
      borderColor: "#1F588B",
      value: isOn ? filteredTotalTurnOver1.reduce(
        (acc, item) => acc + item.currentValue,
        0
      ) : filteredTotalTurnOver.reduce(
        (acc, item) => acc + item.currentValue,
        0
      ),
      previousValue: isOn ? filteredTotalTurnOver1.reduce(
        (acc, item) => acc + item.prevValue,
        0
      ) : filteredTotalTurnOver.reduce(
        (acc, item) => acc + item.prevValue,
        0
      ),
      icon: lab,
    },
    {
      heading: "Attrition Breakup",
      borderColor: "#62AAA3",
      value: isOn ? profit1.reduce((acc, item) => acc + item.currentQty, 0) : profit.reduce((acc, item) => acc + item.currentQty, 0),
      previousValue: isOn ? profit1.reduce((acc, item) => acc + item.comCode, 0) : profit.reduce((acc, item) => acc + item.comCode, 0),
      icon: staff,
    },
    {
      heading: !isOn ? "Staff Last Month Salary" : "Labour Last Month Salary",
      borderColor: "#96A669",
      value: isOn ? filteredTopCus.reduce(
        (acc, item) => acc + item.currentValue,
        0
      ) : filterNewCus.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: isOn ? filteredTopCus.reduce(
        (acc, item) => acc + item.prevValue,
        0
      ) : filterNewCus.reduce(
        (acc, item) => acc + item.prevValue,
        0
      ),
      icon: money,
    },
    {
      heading: "Employees' Pf Details",
      borderColor: "#F4A300",
      value: isOn ? filterLoss.reduce((acc, item) => acc + item.currentValue, 0) : filterLoss01.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: isOn ? filterLoss.reduce((acc, item) => acc + item.prevValue, 0) : filterLoss01.reduce((acc, item) => acc + item.prevValue, 0),
      icon: worker,
    },
    {
      heading: "Employees' Esi Details",
      borderColor: "#F4A300",
      value: isOn ? filterLoss1.reduce((acc, item) => acc + item.currentValue, 0) : filterLoss11.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: isOn ? filterLoss1.reduce((acc, item) => acc + item.prevValue, 0) : filterLoss11.reduce((acc, item) => acc + item.prevValue, 0),
      icon: worker,
    },
  ];

  const [activeTabs, setActiveTabs] = useState(data.map(() => "total"));

  const toggleTab = (index, tab) => {
    const newTabs = [...activeTabs];
    newTabs[index] = tab;
    setActiveTabs(newTabs);
  };
   console.log()
  const calculatePercentage = (value, totalValue) => {
    if (totalValue === 0) return 0;
    return ((value / totalValue) * 100).toFixed(2);
  };

  return (
    <div className="flex w-full">
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-2 bg-gray-200">
      {data.map((val, i) => {
        const totalValue = val.value + val.previousValue;
        const malePercentage = calculatePercentage(val.previousValue, totalValue);
        const femalePercentage = calculatePercentage(val.value, totalValue);
  
        return (
          <div
            key={i}
            className="relative rounded-lg shadow-md bg-gradient-to-tr from-white to-gray-100 transform hover:scale-105 hover:shadow-lg transition-all duration-300 h-[138px] p-3"
          >
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {val.heading}
              </h2>
              <div className="flex justify-between items-center">
                <p
                  className="text-xl font-bold text-[#CA8A04] mb-1 mt-4"
                  style={{
                    color:
                      color ||
                      "linear-gradient(to top right, #FFD700, #F4A300)",
                  }}
                >
                  {activeTabs[i] === "total"
                    ? totalValue.toLocaleString()
                    : activeTabs[i] === "previousValue"
                    ? val.previousValue.toLocaleString()
                    : val.value.toLocaleString()}
                </p>
                <p
                  className="text-xl font-bold text-gray-800 mt-4"
                  style={{
                    color:
                      color ||
                      "linear-gradient(to top right, #FFD700, #F4A300)",
                  }}
                >
                  {activeTabs[i] === "total"
                    ? "100%"
                    : activeTabs[i] === "previousValue"
                    ? `${malePercentage}%`
                    : `${femalePercentage}%`}
                </p>
              </div>
            </div>
  
            <div className="flex justify-between mt-3">
              <button
                onClick={() => toggleTab(i, "total")}
                className={`w-1/3 px-1 py-1 rounded-l-full text-xs font-medium shadow-md transition ${
                  activeTabs[i] === "total"
                    ? "text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-[#232E3F] hover:text-white"
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
        );
      })}
    </div>
  <ModelMultiSelect
                  selectedBuyer={selectedBuyer}
                  setSelectedBuyer={setSelectedBuyer}
                  color={color}
                  selectedState={selectedState}
                  setSelectedState={ setSelectedState}
              />
     
    </div>
  );
  
};

export default NumericCard;
