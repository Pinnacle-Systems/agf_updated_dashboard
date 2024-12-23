import React, { useState } from "react";
import DropdownCom from "../Ui Component/modelParam";
import { FaUserPlus, FaBriefcase, FaUsers } from "react-icons/fa";

const ModelMultiSelect = ({ selectedBuyer, setSelectedBuyer, color, selectedState, setSelectedState,showModel,setShowModel }) => {
  // const [showModel, setShowModel] = useState(false);
 console.log(showModel,"showModel")
  const handleButtonClick = (state) => {
    setSelectedState(state);
  };

  const handleArrowClick = () => {
    setShowModel((prevState) => !prevState);
  };

  return (
    <div>
      <div>
        {/* Arrow Toggle Button */}
        {/* <div
          className={`arrow-button bg-white border border-gray-200 hover:bg-gray-100 shadow-lg rounded-lg px-3 py-1 flex items-center justify-center transition-all duration-300 ${
            showModel ? "translate-y-[300px]" : "translate-y-0"
          }`}
          onClick={handleArrowClick}
          style={{
            position: "absolute",
            top: "65px",
            left: "38px",
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
        </div> */}

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
            <div className="mb-7">
              <label
                htmlFor="employeeType"
                className="text-[16px] font-semibold text-gray-700 mb-2 transition-all duration-300 hover:text-gray-800"
              >
                Select Employee Type
              </label>
            </div>

            <div className="flex items-center gap-4 mb-2">
              {/* All Button */}
              <button
                onClick={() => handleButtonClick("All")}
                className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                  selectedState === "All" ? "bg-blue-600" : "bg-blue-500"
                } hover:bg-blue-700 shadow-lg transition-all duration-150`}
              >
                <span className="absolute top-[-1.5rem] text-[#3F83F8] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                  All
                </span>
                <FaUserPlus className="text-xl" />
              </button>

              {/* Labour Button */}
              <button
                onClick={() => handleButtonClick("Labour")}
                className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                  selectedState === "Labour" ? "bg-green-600" : "bg-green-500"
                } hover:bg-green-700 shadow-lg transition-all duration-150`}
              >
                <span className="absolute top-[-1.5rem] text-[#0E9F6E] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                  Labour
                </span>
                <FaBriefcase className="text-xl" />
              </button>

              {/* Staff Button */}
              <button
                onClick={() => handleButtonClick("Staff")}
                className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                  selectedState === "Staff" ? "bg-purple-600" : "bg-purple-500"
                } hover:bg-purple-700 shadow-lg transition-all duration-150`}
              >
                <span className="absolute top-[-1.5rem] text-[#7E3AF2] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                  Staff
                </span>
                <FaUsers className="text-xl" />
              </button>
            </div>

            <label
              htmlFor="employeeType"
              className="text-[16px] font-semibold text-gray-700 mb-2 transition-all duration-300 hover:text-gray-800"
            >
              Select Company
            </label>

            {/* Dropdown Component */}
            <DropdownCom
              selectedBuyer={selectedBuyer}
              setSelectedBuyer={setSelectedBuyer}
              columnHeaderHeight="20"
            />
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
    </div>
  );
};

export default ModelMultiSelect;
