import React, { useContext } from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { ColorContext } from '../scenes/global/context/ColorContext';

const FilterOptions = ({ onFilterClick, onInfoShowText, isGroupHover }) => {
    const { color } = useContext(ColorContext);
    return (
        <div className={`flex text-xs ${isGroupHover ? "opacity-0 transition-opacity duration-300 hover:cursor-pointer hover:shadow-md group-hover:opacity-100" : ""}`} style={{
            color: color
        }}>

            <FilterAltIcon
                onClick={onFilterClick}
                className="w-1 h-1 "
                alt="Filter"
            />
            <Tooltip title={onInfoShowText}>
                <InfoIcon
                    className="w-1 h-1"
                    alt="Info"
                />
            </Tooltip>
        </div>
    )
}

export default FilterOptions
