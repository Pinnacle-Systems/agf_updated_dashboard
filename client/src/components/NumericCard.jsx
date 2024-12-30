import React, { useState, useContext, useEffect } from "react";
import { ColorContext } from "../scenes/global/context/ColorContext";
import './ToggleSwitch.css';
import './Model.css';
import ModelMultiSelect from "./ModelMultiSelect";
import FilterOptions from "./FilterOptions";
import Movable from "./Movable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faMale, faFemale } from "@fortawesome/free-solid-svg-icons";
const NumericCard = ({ misData, selectedBuyer,
  setSelectedBuyer,

}) => {
  const totalTurnOver = misData?.data?.totalTurnOver || [];
  const totalTurnOver1 = misData?.data?.totalTurnOver1 || [];
  const profit = misData?.data?.profit || [];
  const profit1 = misData?.data?.profit1 || [];
  const [selectedState, setSelectedState] = useState("");
  const [showModel, setShowModel] = useState(false);

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
      heading: selectedState == "Labour" ? "Labour on Roll": selectedState == "Staff"? "Staff on Roll": "Overall on Roll",
      borderColor: "#1F588B",
      value: selectedState == "Labour" ? filteredTotalTurnOver1.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? filteredTotalTurnOver.reduce((acc, item) => acc + item.currentValue, 0)
          : filteredTotalTurnOver.reduce((acc, item) => acc + item.currentValue, 0) + filteredTotalTurnOver1.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? filteredTotalTurnOver1.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? filteredTotalTurnOver.reduce((acc, item) => acc + item.prevValue, 0)
          : filteredTotalTurnOver1.reduce((acc, item) => acc + item.prevValue, 0) + filteredTotalTurnOver.reduce((acc, item) => acc + item.prevValue, 0),

    },
    {
      heading: selectedState == "Labour" ? "Labour Attrition Breakup": selectedState == "Staff"? "Staff Attrition Breakup": "Overall Attrition Breakup",

      borderColor: "#62AAA3",
      value: selectedState == "Labour" ? profit1.reduce((acc, item) => acc + item.currentQty, 0)
        : selectedState == "Staff" ? profit.reduce((acc, item) => acc + item.currentQty, 0)
          : profit1.reduce((acc, item) => acc + item.currentQty, 0) + profit1.reduce((acc, item) => acc + item.currentQty, 0),
      previousValue: selectedState == "Labour" ? profit1.reduce((acc, item) => acc + item.comCode, 0)
        : selectedState == "Staff" ? profit.reduce((acc, item) => acc + item.comCode, 0) :
          profit1.reduce((acc, item) => acc + item.comCode, 0) + profit.reduce((acc, item) => acc + item.comCode, 0),

    },
    {
      heading: selectedState == "Labour" ? "Labour Last Month Salary" : selectedState == "Staff"? "Staff Last Month Salary":"Overall Last Month Salary" ,
      borderColor: "#96A669",
      value: selectedState == "Labour" ? filteredTopCus.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? filterNewCus.reduce((acc, item) => acc + item.currentValue, 0) :
          filteredTopCus.reduce((acc, item) => acc + item.currentValue, 0) + filterNewCus.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? filteredTopCus.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? filterNewCus.reduce((acc, item) => acc + item.prevValue, 0) :
          filteredTopCus.reduce((acc, item) => acc + item.prevValue, 0) + filterNewCus.reduce((acc, item) => acc + item.prevValue, 0),

    },
    {
      heading: selectedState == "Labour" ? "Labour Pf Details" : selectedState == "Staff"? "Staff Pf Details":"Overall Pf Details" ,
      borderColor: "#F4A300",
      value: selectedState == "Labour" ? filterLoss.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? filterLoss01.reduce((acc, item) => acc + item.currentValue, 0) :
          filterLoss.reduce((acc, item) => acc + item.currentValue, 0) + filterLoss01.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? filterLoss.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? filterLoss01.reduce((acc, item) => acc + item.prevValue, 0) :
          filterLoss.reduce((acc, item) => acc + item.prevValue, 0) + filterLoss01.reduce((acc, item) => acc + item.prevValue, 0),

    },
    {
      heading: selectedState == "Labour" ? "Labour Esi Details" : selectedState == "Staff"? "Staff Esi Details":"Overall Esi Details" ,
      borderColor: "#F4A300",
      value: selectedState == "Labour" ? filterLoss1.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? filterLoss11.reduce((acc, item) => acc + item.currentValue, 0) :
          filterLoss1.reduce((acc, item) => acc + item.currentValue, 0) + filterLoss11.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? filterLoss1.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? filterLoss11.reduce((acc, item) => acc + item.prevValue, 0) :
          filterLoss1.reduce((acc, item) => acc + item.prevValue, 0) + filterLoss11.reduce((acc, item) => acc + item.prevValue, 0),

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

  const handleFilterClick = () => {
    setShowModel((prevState) => !prevState);
  };

  const onInfoShowText = selectedState == "All" ? "All Employees" : selectedState;


  return (
    <div className="flex w-full">
      {showModel && (
        <Movable divId="cardMovable">
          <ModelMultiSelect
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
            color={color}
            showModel={showModel}
            setShowModel={setShowModel}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
          />
        </Movable>
      )}  
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-2 bg-gray-200">
        {data.map((val, i) => {
          const totalValueIndex0 = data[0].value + data[0].previousValue;
          const totalValue = val.value + val.previousValue;
          const malePercentage = calculatePercentage(val.previousValue,(i === 1) ? totalValueIndex0 : totalValue);
          const femalePercentage = calculatePercentage(val.value,(i === 1) ? totalValueIndex0 : totalValue);


          return (
            <div
              key={i}
              className="group relative rounded-lg shadow-md bg-gradient-to-tr from-white to-gray-100 transform hover:scale-105 hover:shadow-lg transition-all duration-300 h-[138px] p-3"
            >
              <div className="text-center">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">
                    {val.heading}
                  </h4>
                  <span
                    className="text-gray-600 text-2xl transition-transform duration-300"
                    style={{ color: color ? `${color}` : "#4B5563" }}
                  >
                    <FilterOptions isGroupHover onFilterClick={handleFilterClick} onInfoShowText={onInfoShowText} />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p
                    className="text-lg font-bold text-[#CA8A04] mb-1 mt-4"
                    style={{
                      color: color || "linear-gradient(to top right, #FFD700, #F4A300)",
                    }}
                  >
                    {activeTabs[i] === "total"
                      ? totalValue.toLocaleString()
                      : activeTabs[i] === "previousValue"
                      ? val.previousValue.toLocaleString()
                      : val.value.toLocaleString()}
                  </p>
                  <span
  className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 shadow-md hover:bg-gray-300 transition-all duration-200"
>
  {activeTabs[i] === "total" && (
    <FontAwesomeIcon
      icon={faUsers}
      className="text-xl text-gray-700 opacity-40 hover:opacity-100 transition-opacity duration-200"
    />
  )}
  {activeTabs[i] === "previousValue" && (
    <FontAwesomeIcon
      icon={faMale}
      className="text-xl text-gray-600 opacity-50 hover:opacity-100 transition-opacity duration-200"
    />
  )}
  {activeTabs[i] !== "total" && activeTabs[i] !== "previousValue" && (
    <FontAwesomeIcon
      icon={faFemale}
      className="text-xl text-pink-600 opacity-40 hover:opacity-100 transition-opacity duration-200"
    />
  )}
</span>
                  <p
                    className="text-lg font-bold text-gray-800 mt-4"
                    style={{
                      color: color || "linear-gradient(to top right, #FFD700, #F4A300)",
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
    </div>
  );
};

export default NumericCard;




