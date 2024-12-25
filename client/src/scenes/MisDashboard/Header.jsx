import React from 'react';
import NumericCard from '../../components/NumericCard';
import './HeaderStyles.css'; // Import your CSS file

const Header = ({
    selectedBuyer,
    setSelectedBuyer,
    refetch,
    misData,
}) => {
    return (
        <NumericCard
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
            refetch={refetch}
            misData={misData}
        />
    );
};

export default Header;
