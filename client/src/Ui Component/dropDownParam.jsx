import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";

export default function DropdownDt({ selected, setSelected, option }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (option) {
      const mappedOptions = option.map((item) => ({
        name: item.buyerName,
        value: item.buyerName,
      }));
      setOptions(mappedOptions);
    }
  }, [option]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Label */}
    

      {/* Dropdown */}
      <div className="relative">
        <Dropdown
          id="buyerDropdown"
          value={selected}
          onChange={(e) => setSelected(e.value)}
          options={options}
          placeholder="Select Buyer"
          className="w-full bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
          style={{
            fontSize: "14px",
            padding: "10px 14px",
          }}
          panelClassName="custom-dropdown-panel"
          optionLabel="name"
        />
      </div>

      {/* Dropdown Panel Styling */}
      <style jsx>{`
        .p-dropdown .p-dropdown-panel {
          border-radius: 8px;
          border: 1px solid #d1d5db;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          max-height: 200px;
          overflow-y: auto;
        }
        .p-dropdown .p-dropdown-item {
          padding: 12px 16px;
          font-size: 12px;
          color: #374151;
        }
        .p-dropdown .p-dropdown-item:hover {
          background-color: #eff6ff;
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
