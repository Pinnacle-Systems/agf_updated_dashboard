import React, { useState, useContext } from "react";
import BuyerWiseRevenueGen from "../BuyerWiseRev/BuyerWiseRevenue";
import { useGetMisDashboardOrdersInHandQuery } from "../../../redux/service/misDashboardService";
import BuyerMultiSelect from "../../../components/ModelMultiSelect1";
import { ColorContext } from "../../global/context/ColorContext";
import CardWrapper from "../../../components/CardWrapper";

const PieChart = () => {
  const [selected, setSelected] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const { data } = useGetMisDashboardOrdersInHandQuery({ params: { filterBuyer: selected } });
  const ordersInHandBuyerWise = data?.data || "";
  const { color } = useContext(ColorContext);

  const handleFilterClick = () => {
    setShowModel(true); // Opens the modal without altering `selected`.
  };

  return (
    <CardWrapper heading={"Age Distribution"} onFilterClick={handleFilterClick}>
      <div
        id="chart"
        className="mt-2 mb-2 rounded-lg"
        style={{
          width: "100%",
          height: "360px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <BuyerWiseRevenueGen buyerRev={ordersInHandBuyerWise} color={color} />
      </div>

      {showModel && (
        <BuyerMultiSelect
          selected={selected} // Persist the selected value
          setSelected={setSelected} // Allow updates to the selected state
          color={color}
          showModel={showModel}
          setShowModel={setShowModel} // Close the modal without resetting `selected`
        />
      )}
    </CardWrapper>
  );
};

export default PieChart;
