import React, { useState, useContext } from 'react';
import Switch from '@mui/material/Switch';
import DropdownCom from '../../Ui Component/modelParam';
import { HiOutlineRefresh } from 'react-icons/hi';
import NumericCard from '../../components/NumericCard';
import { ColorContext } from '../global/context/ColorContext';
import { Tooltip } from '@mui/material';
import './HeaderStyles.css'; // Import your CSS file
import ModelMultiSelect from '../../components/ModelMultiSelect';

const Header = ({
    selectedBuyer,
    setSelectedBuyer,
    refetch,
    misData,
}) => {
    const [checked, setChecked] = useState(true);
    const { color } = useContext(ColorContext);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    console.log(selectedBuyer, "selectfor Header")

    return (
        <>
            {/* Header Section */}
            <div className="bg-[#1F2937] h-[10px] flex justify-between items-center px-4 mb-1">
           
           
            </div>

            {/* Numeric Card */}
            {console.log(selectedBuyer,'selected Buyer rr')}
            
            <div>
                <NumericCard
                    selectedBuyer={selectedBuyer}
                    setSelectedBuyer={setSelectedBuyer}
                    refetch={refetch}
                    misData={misData}

                    checked={checked}
                />
            </div>
        </>
    );
};

export default Header;
