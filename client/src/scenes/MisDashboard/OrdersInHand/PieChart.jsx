import React, { useState } from 'react';
import PieChartTemplate from '../../../components/PieChartTemplate';
import { useGetMisDashboardOrdersInHandQuery } from '../../../redux/service/misDashboardService';
import { HiOutlineRefresh } from 'react-icons/hi';
import DropdownDt from '../../../Ui Component/dropDownParam';
import { useGetBuyerNameQuery } from '../../../redux/service/commonMasters';
import MyFunnel from '../../../components/DonutChartMui';
import BuyerWiseRevenueGen from '../BuyerWiseRev/BuyerWiseRevenue'
const PieChart = () => {
    const [selected, setSelected] = useState();
    const { data, refetch } = useGetMisDashboardOrdersInHandQuery({ params: { filterBuyer: selected } });
    const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
    const ordersInHandBuyerWise = data?.data ? data?.data : '';
    const option = buyer?.data ? buyer?.data : [];

    return (
        <div className='w-full h-full  flex flex-col  items-center justify-between '>
            <div className='flex w-full justify-end'>
                <DropdownDt selected={selected} setSelected={setSelected} option={option} />
                <div className='flex  group relative'>

                    <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-6 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40'>
                        Refresh
                    </span>
                </div>
            </div>
            <div>
                {/* <MyFunnel topSupplierLastTrurnOver={ordersInHandBuyerWise} /> */}
                <BuyerWiseRevenueGen buyerRev={ordersInHandBuyerWise} />
            </div>
        </div>
    );
}

export default PieChart;
