import React from 'react'
import CardWrapper from '../../../components/CardWrapper'
import PieChart from './PieChart'

const OrdersInHand = ({ selectedBuyer, setSelectedBuyer,
    selectedYear, setSelectedYear,
    selectedMonth, setSelectedMonth,

    refetch, misData }) => {
    return (
        <CardWrapper heading={"Age Distribution"}>
            <PieChart selectedBuyer={selectedBuyer} selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                setSelectedBuyer={setSelectedBuyer} setSelectedYear={setSelectedYear} setSelectedMonth={
                    setSelectedMonth} refetch={refetch} misData={misData} />
        </CardWrapper>
    )
}

export default OrdersInHand