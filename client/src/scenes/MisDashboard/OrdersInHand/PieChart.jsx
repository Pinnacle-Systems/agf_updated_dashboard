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
            <div
                id="chart"
                className="mt-2 mb-2 rounded-lg"
                style={{
                    width: '100%', 
                    height: '360px',
                    backgroundColor: '#fff', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    borderRadius: "10px"
                }}
            >
            <BuyerWiseRevenueGen buyerRev={ordersInHandBuyerWise}  color={color} />
            </div>

                {showModel && (
                    <BuyerMultiSelect
                        selected={selected}
                        setSelected={setSelected}
                        color={color}
                        showModel={showModel}
                        setShowModel={setShowModel}
                    />
                )}
            
        </CardWrapper>
    );
};

export default PieChart;
