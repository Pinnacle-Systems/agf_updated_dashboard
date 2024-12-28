import React from 'react';
import NumericCard from '../../components/NumericCard';
import './HeaderStyles.css'; 
import staff from "../../assets/staff.png"
const Header = ({
    selectedBuyer,
    setSelectedBuyer,
    refetch,
    misData,
}) => {
    return (
        <>
       {/* <div className='absolute right-0 top-0' >
  <img
    src={staff}
    style={{ width: '20%', height: 'auto', borderRadius: '8px', zIndex: 10, position: 'relative' }}
  />
      </div> */}
        <NumericCard
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
            refetch={refetch}
            misData={misData}
        />
        </>
      
    );
};

export default Header;
