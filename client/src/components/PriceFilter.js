import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";

const PriceFilter = ({ minPrice, maxPrice, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);

    if (name === "min") {
      setPriceRange((prev) => ({
        ...prev,
        min: Math.min(newValue, prev.max - 1),
      }));
      onFilterChange(newValue, priceRange.max);
    } else if (name === "max") {
      setPriceRange((prev) => ({
        ...prev,
        max: Math.max(newValue, prev.min + 1),
      }));
      onFilterChange(priceRange.min, newValue);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 w-full">
      <h2 className="text-lg font-bold text-gray-700 text-center mb-5">
        Filter by Price
      </h2>

      {/* Dual Slider Track */}
      <div className="relative w-full h-2 bg-gray-300 rounded-lg overflow-hidden mb-6">
        <div
          className="absolute h-2 bg-blue-500 rounded-lg"
          style={{
            left: `${((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100}%`,
            width: `${
              ((priceRange.max - priceRange.min) / (maxPrice - minPrice)) * 100
            }%`,
          }}
        />
        <input
          type="range"
          name="min"
          min={minPrice}
          max={maxPrice}
          value={priceRange.min}
          onChange={handleSliderChange}
          className="absolute w-full top-0 h-2 appearance-none bg-transparent cursor-pointer"
        />
        <input
          type="range"
          name="max"
          min={minPrice}
          max={maxPrice}
          value={priceRange.max}
          onChange={handleSliderChange}
          className="absolute w-full top-0 h-2 appearance-none bg-transparent cursor-pointer"
        />
      </div>

      {/* Min & Max Inputs */}
      <div className="flex justify-between space-x-4">
        <div className="flex items-center gap-2 w-1/2">
          <span className="text-gray-500">₹</span>
          <input
            type="number"
            name="min"
            value={priceRange.min}
            onChange={handleSliderChange}
            className="w-full p-2 border border-blue-400 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-1/2">
          <span className="text-gray-500">₹</span>
          <input
            type="number"
            name="max"
            value={priceRange.max}
            onChange={handleSliderChange}
            className="w-full p-2 border border-blue-400 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Apply & Reset Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPriceRange({ min: minPrice, max: maxPrice })}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
        >
          Reset
        </button>
        <button
          onClick={() => onFilterChange(priceRange.min, priceRange.max)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const PriceFilterModal = ({ minPrice, maxPrice, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        <FaFilter />
        <span className="text-sm">Price Filter</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-[90%] max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-red-500 text-lg font-bold hover:text-red-700"
            >
              ✕
            </button>

            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onFilterChange={onFilterChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilterModal;
