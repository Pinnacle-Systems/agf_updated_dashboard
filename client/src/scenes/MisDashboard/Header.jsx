import React, { useState, useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import DropdownCom from '../../Ui Component/modelParam';
import { HiOutlineRefresh } from 'react-icons/hi';
import NumericCard from '../../components/NumericCard';
import { ColorContext } from '../global/context/ColorContext';
import { Tooltip } from '@mui/material';

const Header = ({
    selectedBuyer,
    setSelectedBuyer,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    refetch,
    misData,
}) => {
    const [checked, setChecked] = useState(true);
    const { color } = useContext(ColorContext);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const CustomSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase': {
            color: '#bdbdbd',
            '&.Mui-checked': {
                color: color || '#4caf50',
                '& + .MuiSwitch-track': {
                    background: `linear-gradient(90deg, ${color || '#4caf50'} 0%, #81c784 100%)`,
                    opacity: 1,
                },
            },
        },
        '& .MuiSwitch-thumb': {
            width: 18,
            height: 18,
        },
        '& .MuiSwitch-track': {
            borderRadius: 20,
            backgroundColor: '#e0e0e0',
            opacity: 1,
        },
    }));

    return (
        <>
            {/* Header Section */}
            <div className="bg-[#1F2937] h-[40px] flex justify-between items-center px-4 mb-2">
                <div className="flex items-center">
                    <label className="text-sm text-white mr-3">Select:</label>
                    <DropdownCom
                        selectedBuyer={selectedBuyer}
                        setSelectedBuyer={setSelectedBuyer}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        columnHeaderHeight="20"
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <Tooltip title="Refresh Data">
                        <button
                            className="bg-gray-800 rounded p-2 flex items-center justify-center text-white border-2 border-gray-600 hover:bg-gray-700 transition duration-200"
                            onClick={refetch}
                        >
                            <HiOutlineRefresh size={20} />
                        </button>
                    </Tooltip>

                    <div className="flex items-center text-white">
                        <label className="text-sm font-medium mr-2">
                            {checked ? 'Esi' : 'PF'}
                        </label>
                        <CustomSwitch
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>
                </div>
            </div>

            {/* Numeric Card */}
            <div>
                <NumericCard misData={misData} selectedBuyer={selectedBuyer} checked={checked} />
            </div>
        </>
    );
};

export default Header;
