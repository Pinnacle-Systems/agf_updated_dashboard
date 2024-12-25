import React from 'react'
import PieChart from './PieChart'

const OrdersInHand = ({ selectedBuyer, setSelectedBuyer,
    selectedYear, setSelectedYear,
    selectedMonth, setSelectedMonth,
    refetch, misData }) => {
    return (
        <PieChart selectedBuyer={selectedBuyer} selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            setSelectedBuyer={setSelectedBuyer} setSelectedYear={setSelectedYear} setSelectedMonth={
                setSelectedMonth} refetch={refetch} misData={misData} />
    )
}

export default OrdersInHand