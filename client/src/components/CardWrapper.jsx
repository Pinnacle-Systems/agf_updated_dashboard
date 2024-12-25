import React from 'react';
import { ColorContext } from '../scenes/global/context/ColorContext';
import { useContext } from 'react';
const CardWrapper = ({ heading, children }) => {
    const { color } = useContext(ColorContext); 

    return (
        <div className='w-full h-full text-center border border-gray-300 rounded-lg shadow-lg bg-white h-[450px]'>
            <div className=' text-center rounded-t-lg flex items-center justify-center h-[30px] shadow-md'  style={{
    background: color 
      ? color 
      : 'linear-gradient(to top right, #FFD700, #F4A300)',
  }}>
                <span className='text-[16px] font-semibold text-white tracking-wider'>
                    {heading}
                </span>
            </div>
                <div className='h-[90%] p-4 bg-gradient-to-br from-gray-50 to-gray-200 rounded-b-lg shadow-inner'>
                {children}
            </div>
        </div>
    );
};

export default CardWrapper;
