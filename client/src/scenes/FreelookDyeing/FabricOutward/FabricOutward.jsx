import { useGetFinYearQuery } from "../../../redux/service/misDashboardService";
import OutwardType from "./OutwardType";
import { useState } from "react";

const FabricOutward = () => {
  const [fYear, setFYear] = useState("26-27");
  const { data: finYear } = useGetFinYearQuery();
  return (
    <>
      <OutwardType year={fYear} finYear={finYear} />
    </>
  );
};

export default FabricOutward;
