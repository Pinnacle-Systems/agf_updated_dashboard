import React, { useState } from 'react'

import { useGetTopItemsQuery } from '../../../redux/service/poData';
import SortedBarChart from './SortedBarChart';
import CardWrapper from '../../../components/CardWrapper';
import BuyerMultiSelect from '../../../components/ModelMultiSelect1';

const BloodGrp = ({ option }) => {
    const [selected, setSelected] = useState();
    const [showModal, setShowModal] = useState(false);
    const { data: topItem } = useGetTopItemsQuery({ filterBuyer: selected })
    const topItems = topItem?.data || [];
    return (
        <CardWrapper heading={"Blood Group Distribution"} onFilterClick={() => { setShowModal(true) }} >
                        <SortedBarChart topItems={topItems} />

            {showModal &&
                <BuyerMultiSelect
                    selected={selected}
                    setSelected={setSelected}
                    showModel={showModal}
                    setShowModel={setShowModal}
                />
            }
        </CardWrapper>
    )
}

export default BloodGrp
