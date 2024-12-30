import SelectBuyer from "../Ui Component/modelParam";
import { FaUserPlus, FaBriefcase, FaUsers } from "react-icons/fa";
import * as React from "react";
import { useState, useRef, useEffect } from "react";

const ModelMultiSelect = ({
  selectedBuyer,
  setSelectedBuyer,
  color,
  selectedState,
  setSelectedState,
  showModel,
  setShowModel,
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [dragging, setDragging] = useState(false);
  const startPosition = useRef(null); // To store the starting position when dragging starts

  // When the modal is shown, position it at the center
  useEffect(() => {
    if (showModel) {
      setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }, [showModel]);

  const handleMouseDown = (e) => {
    setDragging(true);
    startPosition.current = { x: e.clientX, y: e.clientY }; // Store the initial mouse position when drag starts
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - startPosition.current.x; // Calculate the movement in x direction
      const dy = e.clientY - startPosition.current.y; // Calculate the movement in y direction

      // Update position only when dragging
      setPosition((prevPosition) => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy,
      }));

      // Update start position for the next move
      startPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative"
    >
      {showModel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setShowModel(false)}
        ></div>
      )}

      {showModel && (
        <div
          className={`model-box fixed bg-gray-100 shadow-xl transition-transform duration-500`}
          style={{
            top: position.y || "50%",
            left: position.x || "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            borderRadius: "8px",
            borderTop: `8px solid ${color || "#3B82F6"}`,
            width: "300px",
            height: "500px",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="model-content p-5 h-full overflow-y-auto">
            <div className="mb-2">
              <label
                htmlFor="employeeType"
                className="text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 hover:text-gray-800"
              >
                Select Employee Type
              </label>
            </div>
            <div className="flex items-center gap-4 mb-2">
              {[{ type: "All", icon: <FaUserPlus />, color: "blue" },
                { type: "Labour", icon: <FaBriefcase />, color: "green" },
                { type: "Staff", icon: <FaUsers />, color: "purple" }]
                .map(({ type, icon, color: btnColor }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedState(type)}
                    className={`group relative flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full ${selectedState === type
                      ? `bg-${btnColor}-600 shadow-lg scale-105 text-white`
                      : `bg-white border-2 border-${btnColor}-500 text-${btnColor}-500 hover:bg-${btnColor}-500 hover:text-white hover:shadow-lg hover:scale-110`
                      }`}
                  >
                    {React.cloneElement(icon, {
                      className: `text-xl ${selectedState === type ? "text-white" : `text-${btnColor}-500`}`,
                    })}
                  </button>
                ))}
            </div>

            <label
              htmlFor="companySelect"
              className="block text-sm font-semibold text-gray-700 mb-3"
            >
              Select Company
            </label>

            <SelectBuyer
              selectedBuyer={selectedBuyer}
              setSelectedBuyer={setSelectedBuyer}
              columnHeaderHeight="20"
            />

            <button
              className="absolute right-3 bottom-5 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: color || "#1D4ED8",
              }}
              onClick={() => setShowModel(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelMultiSelect;
