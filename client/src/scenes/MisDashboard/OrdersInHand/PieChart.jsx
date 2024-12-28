import React, { useState, useContext } from "react";
import BuyerWiseRevenueGen from "../BuyerWiseRev/BuyerWiseRevenue";
import { useGetMisDashboardOrdersInHandQuery } from "../../../redux/service/misDashboardService";
import BuyerMultiSelect from "../../../components/ModelMultiSelect1";
import { ColorContext } from "../../global/context/ColorContext";
import CardWrapper from "../../../components/CardWrapper";

const PieChart = () => {
    const [selected, setSelected] = useState();
    const [showModel, setShowModel] = useState(false);
    const { data } = useGetMisDashboardOrdersInHandQuery({ params: { filterBuyer: selected } });
    const ordersInHandBuyerWise = data?.data || "";
    const { color } = useContext(ColorContext);
    return (
        <CardWrapper heading={"Age Distribution"} onFilterClick={() => { setShowModel(true) }}  >
            <div className="w-full h-full flex flex-col items-center justify-between">
            <BuyerWiseRevenueGen buyerRev={ordersInHandBuyerWise}  color={color} />

                {showModel && (
                    <BuyerMultiSelect
                        selected={selected}
                        setSelected={setSelected}
                        color={color}
                        showModel={showModel}
                        setShowModel={setShowModel}
                    />
                )}
            </div>
        </CardWrapper>
    );
};

export default PieChart;
