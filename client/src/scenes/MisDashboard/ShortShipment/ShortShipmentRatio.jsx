import React, { useContext, useEffect, useState } from 'react';
import { useGetShortShipmantRatioQuery } from '../../../redux/service/misDashboardService';
import 'tailwindcss/tailwind.css';
import { HiOutlineRefresh } from 'react-icons/hi';
import SelectBuyer from '../../../Ui Component/modelParam';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../../redux/service/commonMasters';
import { currentDate } from '../../../utils/hleper';
import CardWrapper from '../../../components/CardWrapper';
import { ColorContext } from '../../global/context/ColorContext';

const ShortShipmentRatio = () => {
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [category, setCategory] = useState('Birthday');
    const [buyerNm, setBuyerNm] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear || '', filterBuyer: selectedBuyer || '' } })
    const { data: year } = useGetFinYearQuery({})
    const [showModal, setShowModal] = useState(false);

    const { color } = useContext(ColorContext);

    useEffect(() => {
        if (buyer?.data || month?.data) {
            const buyerName = (buyer?.data ? buyer?.data : []).map((item) => item.buyerName);
            const monData = (month?.data ? month?.data : []).map((mon) => mon.month);
            const finYearData = (year?.data ? year?.data : []).map((year) => year.finYear);
            setBuyerNm(buyerName);
            setMonthData(monData);
            setYearData(finYearData);
        }
    }, [buyer, month, year]);

    const { data: shipmentData, error, isLoading, refetch } = useGetShortShipmantRatioQuery({ params: { filterCat: category } });
    const shipData = shipmentData?.data ? shipmentData.data : [];

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleOptionChange = (e) => {
        setCategory(e.target.value);
    };

    const formatDateForComparison = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}`;
    };

    const todayDate = formatDateForComparison(new Date());

    return (
        <CardWrapper heading={"Event's Breakup Current Month"} showFilter={false} >
            <div className="flex w-full justify-end">
                <div className='flex gap-2 items-center justify-center'>
                    <label htmlFor="birthday">Birthday :</label>
                    <input
                        type="radio"
                        id="birthday"
                        name='view'
                        value='Birthday'
                        checked={category === 'Birthday'}
                        onChange={handleOptionChange}
                    />
                    <label htmlFor="anniversary">Work Anniversary:</label>
                    <input
                        type="radio"
                        id="anniversary"
                        name='view'
                        value='Anniversary'
                        checked={category === 'Anniversary'}
                        onChange={handleOptionChange}
                    />
                </div>
                <div className='flex group relative justify-end'>
                    <button
                        className='bg-sky-500 rounded-sm p-1 flex items-center justify-center h-[30px] text-center font-normal text-[16px] border-2 border-[#E0E0E0]'
                        onClick={() => refetch()}
                    >
                        <HiOutlineRefresh />
                    </button>
                    <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-5 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0'>
                        Refresh
                    </span>
                </div>
            </div>
            <div className='h-[350px] overflow-scroll'>
                <table className="min-w-full bg-white border border-gray-200 h-full">
                    <thead>
                        <tr>
                            <th className="py-1 px-2 border font-medium text-sm">S No</th>
                            <th className="py-1 px-2 border font-medium text-sm">Id Card</th>
                            <th className="py-1 px-2 border font-medium text-sm">Name</th>
                            <th className="py-1 px-2 border font-medium text-sm">Company</th>
                            <th className="py-1 px-2 border font-medium text-sm">DOB</th>
                            <th className="py-1 px-2 border font-medium text-sm">Age</th>
                            <th className="py-1 px-2 border font-medium text-sm">DOJ</th>
                            <th className="py-1 px-2 border font-medium text-sm">Exp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipData.map((item, index) => {
                            const isTodayDOB = todayDate === formatDateForComparison(item.dob);
                            const isTodayDOJ = todayDate === formatDateForComparison(item.doj);

                            return (
                                <tr key={index}>
                                    <td className="py-1 px-2 border text-[12px]">{index + 1}</td>
                                    <td className="py-1 px-2 border text-[12px]">{item.idCard}</td>
                                    <td className="py-1 px-2 border text-left text-[12px]">{item.name}</td>
                                    <td className="py-1 px-2 border text-center text-[12px]">{item.customer}</td>

                                    <td className={`py-1 px-2 border text-center text-[12px] ${category === 'Birthday' ? 'bg-sky-200 border-white ' : ''} ${isTodayDOB ? 'bg-sky-200 border-white text-green-500 font-medium' : ''}`}>
                                        {currentDate(item.dob)}
                                    </td>
                                    <td className={`py-1 px-2 border text-center text-[12px] ${category === 'Birthday' ? 'bg-sky-200 border-white ' : ''} ${isTodayDOB ? 'bg-sky-200 border-white text-green-500 font-medium' : ''}`}>
                                        {item.age}
                                    </td>
                                    <td className={`py-1 px-2 border text-center text-[12px] ${category === 'Anniversary' ? 'bg-sky-200 border-white ' : ''} ${isTodayDOJ ? 'bg-sky-200 border-white text-green-500 font-medium' : ''}`}>
                                        {currentDate(item.doj)}
                                    </td>
                                    <td className={`py-1 px-2 border text-center text-[12px] ${category === 'Anniversary' ? 'bg-sky-200 border-white ' : ''} ${isTodayDOJ ? 'bg-sky-200 border-white text-green-500 font-medium' : ''}`}>
                                        {item.exp}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div >
        </CardWrapper>
    );
};

export default ShortShipmentRatio;
