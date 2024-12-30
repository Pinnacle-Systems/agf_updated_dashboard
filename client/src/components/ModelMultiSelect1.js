import React, { useContext } from "react";
import DropdownDt from "../Ui Component/dropDownParam";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";
import { ColorContext } from "../scenes/global/context/ColorContext";

const BuyerMultiSelect = ({ selected, setSelected, showModel, setShowModel }) => {
  const { color } = useContext(ColorContext);
  const { data: buyer } = useGetBuyerNameQuery({ params: {} });
  const option = buyer?.data ? buyer?.data : [];

  return (
    <div>
      <div
        className={`model-box ${showModel ? "open" : "closed"}`}
        style={{
          position: "fixed",
          bottom: showModel ? "0" : "-500px",
          left: "10px",
          width: "280px",
          height: "500px",
          backgroundColor: "#F1F3F6",
          boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.3)",
          transition: "bottom 0.3s ease-in-out",
          borderRadius: "8px 8px 0 0",
          zIndex: "800",
          borderTop: `8px solid ${"#7E09F2" || "#7E3AF2"}`,
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
            className="block text-sm font-semibold text-gray-700 mb-3"
          >
            Select Company
          </label>

          {/* Dropdown Component */}
          <div className="mb-4">
            <DropdownDt selected={selected} setSelected={setSelected} option={option} />
          </div>

          <button
            className="absolute right-3 bottom-5 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            style={{
              backgroundColor: color || "#1D4ED8",
            }}
            onClick={() => setShowModel(false)}
          >
            Ok
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {showModel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          style={{
            zIndex: "700", 
          }}
          onClick={() => setShowModel(false)}
        ></div>
      )}
    </div>
  );
};

export default BuyerMultiSelect;
