import React from 'react';
import NumericCard from '../../components/NumericCard';
import DropdownCom from '../../Ui Component/modelParam';
import { HiOutlineRefresh } from 'react-icons/hi';

const Header = ({
    selectedBuyer, setSelectedBuyer,
    selectedYear, setSelectedYear,
    selectedMonth, setSelectedMonth,

    refetch, misData
}) => {
    console.log(misData, 'mis');
    return (
        <>
            <div className='bg-[#1F2937] h-[35px] flex justify-center items-center mb-1 font-semibold'>
                <div className='flex group w-full justify-end relative'>
                    <div className='flex items-center'>
                        <label className='text-sm text-center text-white p-3'>Select :</label>

                        <div>
                            <DropdownCom
                                selectedBuyer={selectedBuyer}
                                setSelectedBuyer={setSelectedBuyer}
                                selectedMonth={selectedMonth}
                                setSelectedMonth={setSelectedMonth}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}

                                columnHeaderHeight={"20"}
                            />   </div>
                    </div>
                    <div>
                        <button
                            className='bg-gray-800 rounded-sm p-1 flex items-center justify-center h-[40px] text-white w-[40px] text-center font-normal text-[18px] border-2 border-[#E0E0E0]'
                            onClick={() => refetch()}>
                            <HiOutlineRefresh />
                        </button>
                    </div>
                </div>
            </div>
            <div className='h-[%]'>
                <NumericCard misData={misData} selectedBuyer={selectedBuyer} />
            </div>
        </>
    );
};

export default Header;
