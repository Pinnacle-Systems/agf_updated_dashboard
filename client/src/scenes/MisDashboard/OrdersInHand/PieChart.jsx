import React, { useState, useContext } from "react";
import BuyerWiseRevenueGen from "../BuyerWiseRev/BuyerWiseRevenue";
import { useGetMisDashboardOrdersInHandQuery } from "../../../redux/service/misDashboardService";
import { useGetBuyerNameQuery } from "../../../redux/service/commonMasters";
import ModelMultiSelect1 from "../../../components/ModelMultiSelect1";
import { ColorContext } from "../../global/context/ColorContext";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const PieChart = () => {
    const [selected, setSelected] = useState();
    const [showModel, setShowModel] = useState(false);

    const handleArrowClick = () => {
        setShowModel((prevState) => !prevState);
    };

    const { data } = useGetMisDashboardOrdersInHandQuery({ params: { filterBuyer: selected } });
    const { data: buyer } = useGetBuyerNameQuery({ params: {} });
    const ordersInHandBuyerWise = data?.data || "";
    const option = buyer?.data || [];
    const { color } = useContext(ColorContext);

    return (
        <div className="w-full h-full flex flex-col items-center justify-between">
            {/* ModelMultiSelect */}
            <ModelMultiSelect1
                selected={selected}
                setSelected={setSelected}
                color={color}
                showModel={showModel}
                setShowModel={setShowModel}
            />
            {/* Filter and Chart Container */}
            <div className="w-full flex items-center justify-between px-4 mb-4">
                {/* Filter Icon */}
                <div className="flex items-center">
                    <FilterAltIcon
                        onClick={handleArrowClick}
                        className="text-gray-600 text-xl cursor-pointer"
                        style={{ color: color || "#4B5563" }}
                        alt="Filter"
                    />
                </div>
            </div>
            {/* Chart */}
            <div className="w-full flex justify-center">
                <BuyerWiseRevenueGen buyerRev={ordersInHandBuyerWise} />
            </div>
        </div>
    );
};

export default PieChart;
