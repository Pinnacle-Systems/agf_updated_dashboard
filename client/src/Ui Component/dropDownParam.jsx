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
    <div className="w-full max-w-md mx-auto p-4">
     
      <Dropdown
        id="buyerDropdown"
        value={selected}
        onChange={(e) => setSelected(e.value)}
        options={options}
        placeholder="Choose a buyer"
        className="w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200 hover:shadow-md"
        style={{
          fontSize: "14px",
          padding: "12px 16px",
        }}
        panelClassName="custom-dropdown-panel"
        optionLabel="name"
      />

      {/* Dropdown Panel Styling */}
      <style jsx>{`
  .p-dropdown .p-dropdown-panel {
    border-radius: 8px;
    border: 1px solid #d1d5db;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    max-height: 250px;
    overflow-y: auto;
    animation: fadeIn 0.2s ease-in-out;
  }

  .p-dropdown .p-dropdown-item {
    padding: 10px 14px; /* Adjusted padding for smaller font size */
    font-size: 10px; /* Reduced font size */
    color: #374151;
    transition: background-color 0.2s, color 0.2s;
  }

  .p-dropdown .p-dropdown-item:hover {
    background-color: #f0f9ff;
    color: #0284c7;
  }

  .p-dropdown .p-dropdown-item.p-highlight {
    background-color: #e0f2fe;
    color: #0369a1;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>

    </div>
  );
}
