import { useContext, useState } from "react";
import * as React from "react";
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import logo from "../../assets/l.png";
import { ChromePicker } from "react-color";
import { ColorContext } from "./context/ColorContext";
import { MdClose } from "react-icons/md"; // Import Close Icon

const Topbar = ({ onLogout }) => {
  const theme = useTheme();
  const { color, setColor } = useContext(ColorContext); 
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <div className="flex h-14">
      <div className="bg-[#1F2937] w-1/2 flex items-center px-4">
        <img
          src={logo}
          alt="user-profile"
          className="w-44 cursor-pointer"
        />
      </div>

      <div
        className="w-1/2 flex justify-between items-center px-4 text-white"
        style={{ backgroundColor: color }}
      >
        <div className="text-xl font-semibold">Management Information Dashboard</div>

        <div className="flex items-center gap-4">
          {/* Theme Picker Button */}
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="text-white hover:text-gray-300 text-sm px-2 py-1 border rounded-lg"
          >
            Select Theme
          </button>

          {showPicker && (
            <div className="absolute top-16 right-4 z-50 bg-white rounded-lg shadow-lg p-2">
              {/* Close Button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <MdClose size={20} />
                </button>
              </div>
              {/* ChromePicker */}
              <ChromePicker
                color={color}
                onChange={handleColorChange}
                disableAlpha={true}
              />
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="text-white hover:text-gray-300 text-2xl focus:outline-none"
          >
            <MdLogout />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
