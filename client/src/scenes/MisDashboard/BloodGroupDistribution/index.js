import React, { useState } from 'react'

import { useGetTopItemsQuery } from '../../../redux/service/poData';
import DropdownDt from '../../../Ui Component/dropDownParam';
import SortedBarChart from './SortedBarChart';

const BloodGrp = ({ option }) => {
    const [selected, setSelected] = useState();
    const { data: topItem } = useGetTopItemsQuery({ filterBuyer: selected })
    const topItems = topItem?.data || [];
    return (
        <div>
            <DropdownDt selected={selected} setSelected={setSelected} option={option} />
            <SortedBarChart topItems={topItems} />
        </div>
    )
}

export default BloodGrp
