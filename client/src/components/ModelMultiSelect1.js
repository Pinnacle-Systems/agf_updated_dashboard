import React, { useState } from "react";
import DropdownDt from "../Ui Component/dropDownParam";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";

const ModelMultiSelect1 = ({ selected, setSelected, color,showModel, setShowModel }) => {
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
          bottom: showModel ? "0" : "-600px",
          left: "0",
          width: "340px",
          height: "500px",
          backgroundColor: "#F1F3F6",
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
          transition: "bottom 0.3s ease",
          borderRadius: "8px 8px 0 0",
          zIndex: 20,
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
          <label
            htmlFor="employeeType"
            className="text-[16px] font-semibold text-gray-700 mb-2 transition-all duration-300 hover:text-gray-800"
          >
            Select Company
          </label>

          {/* Dropdown Component */}
          <div className="flex w-full justify-end">
            <DropdownDt selected={selected} setSelected={setSelected} option={option} />
            <div className="flex group relative">
              <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-6 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40">
                Refresh
              </span>
            </div>
          </div>
          <button
  className={`absolute right-0 bottom-5 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none`}
  style={{
    backgroundColor: color ? color : 'blue',
  }}
  onClick={() => setShowModel(false)}
>
  Enter
</button>
        </div>
      </div>
    </div>
  );
};

export default ModelMultiSelect1;
