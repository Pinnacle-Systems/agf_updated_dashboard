import React, { useState } from "react";
import DropdownDt from "../Ui Component/dropDownParam";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";

const ModelMultiSelect1 = ({ selected, setSelected, color }) => {
  const [showModel, setShowModel] = useState(false);
const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
    const option = buyer?.data ? buyer?.data : [];
  const handleArrowClick = () => {
    setShowModel((prevState) => !prevState);
  };

  return (
    <div>
      <div>
        {/* Arrow Toggle Button */}
        <div
          className={`arrow-button bg-white border border-gray-200 hover:bg-gray-100 shadow-lg rounded-lg px-3 py-1 flex items-center justify-center transition-all duration-300 ${
            showModel ? "translate-y-[300px]" : "translate-y-0"
          }`}
          onClick={handleArrowClick}
          style={{
            position: "absolute",
            top: "242px",
            left: "412px",
            transform: "translateX(-50%)",
            cursor: "pointer",
            zIndex: 30,
          }}
        >
          <span
            className="text-gray-600 text-2xl transition-transform duration-300"
            style={{ color: color ? `${color}` : "#4B5563" }}
          >
            {showModel ? "▲" : "▼"}
          </span>
        </div>

        {/* Slide-Up Model */}
        <div
          className={`model-box ${showModel ? "open" : "closed"}`}
          style={{
            position: "absolute",
            bottom: showModel ? "0" : "-600px", // Adjust the height as needed
            left: "0",
            width: "380px",
            height: "500px", // Height of the sliding model
            backgroundColor: "#F1F3F6",
            boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
            transition: "bottom 0.3s ease",
            borderRadius: "8px 8px 0 0",
            zIndex: "20",
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
            <div className='flex w-full justify-end'>
                <DropdownDt selected={selected} setSelected={setSelected} option={option} />
                <div className='flex  group relative'>

                    <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-6 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40'>
                        Refresh
                    </span>
                </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelMultiSelect1;
