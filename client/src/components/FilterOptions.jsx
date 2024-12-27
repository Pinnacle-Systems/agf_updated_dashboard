import React, { useContext } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { ColorContext } from '../scenes/global/context/ColorContext';

const FilterOptions = ({ onFilterClick, onInfoShowText, isGroupHover }) => {
    const { color } = useContext(ColorContext);

    return (
        <div
            className={`flex items-center space-x-4 p-1 rounded-lg transition-all duration-300 
                ${isGroupHover ? "opacity-0 group-hover:opacity-100 hover:cursor-pointer" : ""} 
                hover:shadow-lg`}
        >
            {/* Filter Button */}
            <div
                onClick={onFilterClick}
                className="flex items-center justify-center w-6 h-6   bg-white rounded-full shadow-md 
                    hover:bg-gray-100 hover:shadow-lg transition-all duration-300 text-sm cursor-pointer"
            >
                <FilterAltIcon
                    className="text-gray-700"
                    style={{ fontSize: "20px" }}
                    alt="Filter"
                />
            </div>

   
        </div>
    );
};

export default FilterOptions;
