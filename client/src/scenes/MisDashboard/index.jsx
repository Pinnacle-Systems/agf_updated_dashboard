import React, { useState, useEffect } from 'react';
import OrdersInHand from './OrdersInHand';
import Header from "./Header";
import OrdersInHandMonthWise from './OrdersInHandMonthWise';
import ActualVsBudgetValueMonthWise from './ActualVsBudgetValueMonthWise';
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

const MisDashboard = () => {
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState();
    const [buyerNm, setBuyerNm] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [options, setOptions] = useState([]);
    const [lastItem, setLastItem] = useState(null);
    const [previousYear, setPreviousYear] = useState(null);
    const [selected, setSelected] = useState();
    const { data: overAllSupData } = useGetOverAllSupplierContributionQuery({ filterBuyer: selected })

    console.log(selected, 'sel');

    const overAllSuppCon = overAllSupData?.data || []
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear || '', filterBuyer: selectedBuyer || '' } });
    const { data: misData, refetch } = useGetMisDashboardQuery({
        params: {
            filterYear: selectedYear,
            previousYear,
            filterBuyer: selectedBuyer,
            filterMonth: selectedMonth
        }
    });
    const { data: finYr } = useGetFinYrQuery();
    const finYear = finYr?.data ? finYr.data : [];

    console.log(selectedBuyer, 'buyer');
    const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });

    const option = buyer?.data ? buyer?.data : [];

    return (
        <div className='h-full w-full overflow-auto px-1'>
            <Header
                selectedBuyer={selectedBuyer}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                setSelectedBuyer={setSelectedBuyer}
                setSelectedYear={setSelectedYear}
                setSelectedMonth={setSelectedMonth}
                refetch={refetch}
                misData={misData}
            />
            <div className='grid grid-cols-4 gap-2 mt-1 h-auto'>
                <YearlyComparisionBuyerWise
                    selectedBuyer={selectedBuyer}
                    setSelectedBuyer={setSelectedBuyer}
                />
                <OrdersInHand
                    selectedBuyer={selectedBuyer}
                    setSelectedBuyer={setSelectedBuyer}
                    setSelectedYear={setSelectedYear}
                    selectedYear={selectedYear}
                />
                 <CardWrapper heading={"Attrition  Breakup"}>
                    <ChartTable />

                </CardWrapper>
                <div className=''>  <CardWrapper heading={"Experience Distribution"}>
                    < TreeMapChart overAllSuppCon={overAllSuppCon} selected={selected}
                        setSelected={setSelected} option={option} />
                </CardWrapper></div>
                <div className=''>  <CardWrapper heading={"Blood Group Distribution"}>
                    <div className=''><BloodGrp option={option} />

                    </div>
                </CardWrapper></div>
               
                <CardWrapper heading={"Retention Breakup"}>
                    <Retention />

                </CardWrapper>
                <div className="col-span-2 ">
    <CardWrapper heading={"Event's Breakup Current Month"}>
      <ShortShip />
    </CardWrapper>  
  </div>
            </div>
3              

3  
        </div>
    );
};

export default MisDashboard;
