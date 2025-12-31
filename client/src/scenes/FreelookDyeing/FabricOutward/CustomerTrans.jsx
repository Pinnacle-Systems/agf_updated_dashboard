import { useEffect, useState } from "react";
import {
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaStepBackward,
    FaStepForward,
    FaSearch,
    FaUserTie,
    FaUsers,
    FaMars,
    FaVenus,
} from "react-icons/fa";
import { IoMaleFemale } from "react-icons/io5";
import * as XLSX from "xlsx";
import { useGetFabricInwardByCusNameQuery } from "../../../redux/service/freeLookFabric";


const CustomerTrans = ({
    closeTable,
    selectmonths,
    fYear,
    setFYear,
    category,
    setCategory,
    custName,
    setCustName
}) => {

    return (
       <></>
    );
};

export default CustomerTrans;

// export default ESIDetailed;
