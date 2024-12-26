import React from 'react';
import { ColorContext } from '../scenes/global/context/ColorContext';
import { useContext } from 'react';
import FilterOptions from './FilterOptions';
const CardWrapper = ({ heading, children, onFilterClick, onInfoShowText, showFilter = true }) => {
    const { color } = useContext(ColorContext);

    return (
        <div className='text-center border border-gray-300 rounded-lg shadow-lg bg-white h-[420px] w-full'>
            <div className=' text-center rounded-t-lg flex items-center justify-between' style={{
                color: color
            }}>
                <span className={`text-[16px] font-semibold tracking-wider px-1 ${showFilter ? '' : 'text-center'}`}>
                    {heading}
                </span>
                {showFilter &&
                    <FilterOptions onFilterClick={onFilterClick} onInfoShowText={onInfoShowText} />
                }
            </div>
            <div className='px-4 rounded-b-lg w-full flex justify-center items-center h-full'>
                <div className='w-full h-full'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CardWrapper;
