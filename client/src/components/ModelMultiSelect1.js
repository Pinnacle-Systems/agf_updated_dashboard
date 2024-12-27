import React, { useContext } from "react";
import DropdownDt from "../Ui Component/dropDownParam";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";
import { ColorContext } from "../scenes/global/context/ColorContext";

const BuyerMultiSelect = ({ selected, setSelected, showModel, setShowModel }) => {
  const { color } = useContext(ColorContext);
  const { data: buyer, } = useGetBuyerNameQuery({ params: {} });
  const option = buyer?.data ? buyer?.data : [];

  return (
    <div>
      <div
        className={`model-box ${showModel ? "open" : "closed"}`}
        style={{
          position: "fixed",
          bottom: "0", // Adjust height
          left: "10px",
          width: "280px",
          height: "500px", // Height of the sliding model
          backgroundColor: "#F1F3F6",
          boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.3)", // Deeper shadow for 3D effect
          transition: "bottom 0.3s ease",
          borderRadius: "8px 8px 0 0",
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
          <label
            htmlFor="employeeType"
            className="text-[14px] font-semibold text-gray-700 mb-2 transition-all duration-300 hover:text-gray-800"
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
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerMultiSelect;
