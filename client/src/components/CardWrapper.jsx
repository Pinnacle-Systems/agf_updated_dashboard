import React from 'react';

const CardWrapper = ({ heading, children }) => {
    return (
        <div className='w-full h-full text-center border border-gray-300 rounded-lg shadow-lg bg-white'>
            <div className='bg-gradient-to-r from-yellow-400 to-yellow-500 text-center rounded-t-lg flex items-center justify-center h-[30px] shadow-md'>
                <span className='text-[16px] font-semibold text-gray-800'>
                    {heading}
                </span>
            </div>
                <div className='h-[80%] p-4 bg-gradient-to-br from-gray-50 to-gray-200 rounded-b-lg shadow-inner'>
                {children}
            </div>
        </div>
    );
};

export default CardWrapper;
