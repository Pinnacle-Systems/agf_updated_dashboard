import React, { useState } from "react";
import DropdownDt from "../Ui Component/dropDownParam";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";
import DropdownData from "../Ui Component/modelUi";
import SelectBuyer from "../Ui Component/modelParam";

const ModelMultiSelectChart2 = ({ color, showModel, setShowModel, selectedYear, setSelectedYear,
  selectedBuyer, setSelectedBuyer }) => {
  const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
  const option = buyer?.data ? buyer?.data : [];

  const handleArrowClick = () => {
    setShowModel((prevState) => !prevState);
  };

  return (
    <div>
      {/* Arrow Toggle Button */}


      {/* Slide-Up Model */}
      <div
        className={`model-box ${showModel ? "open" : "closed"}`}
        style={{
          position: "absolute",
          bottom: showModel ? "0" : "-600px", // Adjust height
          left: "0",
          width: "290px",
          height: "440px", // Height of the sliding model
          backgroundColor: "#F1F3F6",
          boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.3)", // Deeper shadow for 3D effect
          transition: "bottom 0.3s ease",
          borderRadius: "8px 8px 0 0",
          border: "1px solid gray",
          zIndex: "20",
          border: "1px solid rgba(0, 0, 0, 0.1)", // Light border
        }}
      >
        <div
          className="model-content"
          style={{
            padding: "20px",
            overflowY: "auto",
            height: "100%",
          }}
        >


          {/* Dropdown Component */}
          <div className="p-5 overflow-y-auto h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Company</h2>

            {/* Dropdowns */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-600">Year:</label>
                <DropdownData selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
              </div>

              <div className="flex items-center space-x-3">
                <SelectBuyer
                  style={{ width: "200px" }}
                  selectedBuyer={selectedBuyer}
                  setSelectedBuyer={setSelectedBuyer}
                  columnHeaderHeight={"30"}
                />
              </div>
            </div>

          </div>
          <button
            className={`absolute right-0 bottom-5 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none`}
            style={{
              backgroundColor: color ? color : 'blue',
            }}
            onClick={() => setShowModel(false)}
          >
            0k
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelMultiSelectChart2;
