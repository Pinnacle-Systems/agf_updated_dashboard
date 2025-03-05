import React, { useContext, useState } from "react";
import html2canvas from "html2canvas";
import { ColorContext } from "../scenes/global/context/ColorContext";
import FilterOptions from "./FilterOptions";
import { IoMdDownload } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { IoClose } from "react-icons/io5"; 
const DropdownOptions = ({ onDownload, onClose }) => (
  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10 animate-scale-in origin-top-right">
    <div className="absolute right-0">
      <button onClick={onClose} className="text-gray-500 hover:text-red-800 text-red-700 text-lg p-1 transition">
        <IoClose />
      </button>
    </div>

    {/* <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black w-full px-3 py-2 hover:bg-gray-100 rounded-md transition">
      <MdVisibility className="text-lg text-gray-600" /> View
    </button>
    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black w-full px-3 py-2 hover:bg-gray-100 rounded-md transition">
      <MdEdit className="text-lg text-blue-600" /> Edit
    </button>
    <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black w-full px-3 py-2 hover:bg-gray-100 rounded-md transition">
      <MdDelete className="text-lg text-red-600" /> Delete
    </button> */}
    <button onClick={onDownload} className="flex items-center gap-2 text-sm text-gray-700 hover:text-black w-full px-3 py-2 hover:bg-gray-100 rounded-md transition">
      <IoMdDownload className="text-lg text-green-600" /> Download
    </button>
  </div>
);

const CardWrapper1 = ({ heading, children, chartRef, onFilterClick, showFilter = true, Doption = true }) => {
  const { color } = useContext(ColorContext);
  const [showOptions, setShowOptions] = useState(false);
const closetoggle = async()=>{
  setShowOptions(false)
}
const captureScreenshot = async () => {
  if (!chartRef?.current) return;

  try {
    const canvas = await html2canvas(chartRef.current, {
      useCORS: true,
      scale: 2,
    });

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;

    const formattedHeading = heading.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    link.download = `${formattedHeading || "chart_screenshot"}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Screenshot capture failed:", error);
  }
};


  return (
    <div className="text-center border border-gray-300 rounded-lg shadow-lg bg-gray-200 h-[420px] w-full relative">
      {/* Header Section */}
      <div className="flex items-center justify-between h-[40px] px-4 rounded-t-lg shadow-md" style={{ background: color || "#E5E7EB" }}>
        <div className="text-[15px] text-white font-medium tracking-wider">{heading}</div>

        <div className="flex items-center space-x-2 relative">
          <div className="absolute top-0 right-2">
          {showFilter && <FilterOptions onFilterClick={onFilterClick} />}
          </div>
        
          {Doption && (
            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)} className="text-white p-2 rounded-lg transition">
                <CiMenuKebab className="text-xl" />
              </button>
              {showOptions && <DropdownOptions onDownload={captureScreenshot} onClose={closetoggle} />}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 rounded-b-lg w-full flex justify-center items-center h-full">
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default CardWrapper1;
