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
        className="w-full bg-white border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700 transition-all duration-200 hover:shadow-lg"
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
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          max-height: 250px;
          overflow-y: auto;
          animation: fadeIn 0.3s ease-in-out;
          z-index: 999;
        }

        .p-dropdown .p-dropdown-item {
          padding: 12px 16px;
          font-size: 14px;
          color: #374151;
          transition: background-color 0.3s, color 0.3s;
          border-radius: 4px;
        }

        .p-dropdown .p-dropdown-item:hover {
          background-color: #f0f9ff;
          color: #0284c7;
        }

        .p-dropdown .p-dropdown-item.p-highlight {
          background-color: #e0f2fe;
          color: #0369a1;
        }

        .p-dropdown .p-dropdown-item.p-highlight:hover {
          background-color: #d1e9fe;
          color: #0369a1;
        }

        .p-dropdown .p-dropdown-item:focus {
          background-color: #e0f2fe;
          color: #0284c7;
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
