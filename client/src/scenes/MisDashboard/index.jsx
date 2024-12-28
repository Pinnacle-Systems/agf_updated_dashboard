import React, { useState, useEffect } from 'react';
import OrdersInHand from './OrdersInHand';
import Header from "./Header";
import YearlyComparisionBuyerWise from './comParision';
import ShortShip from './ShortShipment';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../redux/service/commonMasters';
import { useGetMisDashboardQuery } from '../../redux/service/misDashboardService';
import { useGetFinYrQuery, useGetOverAllSupplierContributionQuery, useGetTopItemsQuery } from '../../redux/service/poData';

import CardWrapper from '../../components/CardWrapper';
import Retention from './BuyerWiseRev';
import ChartTable from './ChartTableCombo';
import TreeMapChart from '../../components/TreeChart';
import BloodGrp from './BloodGroupDistribution';
import { useContext } from 'react';
import { ColorContext } from '../global/context/ColorContext';
const MisDashboard = () => {
    const [selectedBuyer, setSelectedBuyer] = useState([]);
    const {color} = useContext(ColorContext)
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState();
    const [previousYear, setPreviousYear] = useState(null);
    const [selected, setSelected] = useState();
    const { data: overAllSupData } = useGetOverAllSupplierContributionQuery({ filterBuyer: selected })
    console.log(selected, 'sel');
    
    const overAllSuppCon = overAllSupData?.data || [];

    const { data: misData, refetch } = useGetMisDashboardQuery({
        params: {
            filterYear: selectedYear,
            previousYear,
            filterBuyer: selectedBuyer,
            filterMonth: selectedMonth
        }
    });

    const { data: buyer } = useGetBuyerNameQuery({ params: {} });
    const option = buyer?.data || [];
    return (
        <div className='px-1'>
            <Header
                selectedBuyer={selectedBuyer}
                setSelectedBuyer={setSelectedBuyer}
                refetch={refetch}
                misData={misData}
            />
            <div className='grid grid-cols-4 gap-1 p-0.5 py-1'>
                <YearlyComparisionBuyerWise
                    selectedBuyer={selectedBuyer}
                    setSelectedBuyer={setSelectedBuyer}
                />
                <OrdersInHand
                    selectedBuyer={selectedBuyer}
                    setSelectedBuyer={setSelectedBuyer}
                    setSelectedYear={setSelectedYear}
                    selectedYear={selectedYear}
                    color = {color}                />
                <ChartTable />
                < TreeMapChart overAllSuppCon={overAllSuppCon} selected={selected}
                    setSelected={setSelected} option={option} />
                <BloodGrp option={option} />
                <CardWrapper heading={"Retention Breakup"}>
                    <Retention />
                </CardWrapper>
                <div className="col-span-2 ">
                    <ShortShip />
                </div>
            </div>
        </div>
    );
};

export default MisDashboard;
