import React from 'react'
import PieChart from './PieChart'

const OrdersInHand = (selectedPie,setSelectedPie) => {
    return (
        <PieChart  selected = {selectedPie} setSelected= {setSelectedPie} />
    )
}

export default OrdersInHand