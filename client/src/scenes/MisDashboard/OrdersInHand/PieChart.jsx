import React, { useState } from 'react';
import PieChartTemplate from '../../../components/PieChartTemplate';
import { useGetMisDashboardOrdersInHandQuery } from '../../../redux/service/misDashboardService';
import { HiOutlineRefresh } from 'react-icons/hi';
import DropdownDt from '../../../Ui Component/dropDownParam';
import { useGetBuyerNameQuery } from '../../../redux/service/commonMasters';
import MyFunnel from '../../../components/DonutChartMui';
import BuyerWiseRevenueGen from '../BuyerWiseRev/BuyerWiseRevenue'
import ModelMultiSelect1 from '../../../components/ModelMultiSelect1'
import { ColorContext } from '../../global/context/ColorContext'
import { useContext } from 'react'
const PieChart = () => {
    const [selected, setSelected] = useState();
    const { data, refetch } = useGetMisDashboardOrdersInHandQuery({ params: { filterBuyer: selected } });
    const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
    const ordersInHandBuyerWise = data?.data ? data?.data : '';
    const option = buyer?.data ? buyer?.data : [];
    const{color} = useContext(ColorContext)

    return (
        <div className='w-full h-full  flex flex-col  items-center justify-between '>
                     <ModelMultiSelect1 selected={selected} setSelected= {setSelected} color= {color}  />
         
            <div>
                {/* <MyFunnel topSupplierLastTrurnOver={ordersInHandBuyerWise} /> */}
                <BuyerWiseRevenueGen buyerRev={ordersInHandBuyerWise} />
            </div>
        </div>
    );
}

export default PieChart;
