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
             <div
                id="chart"
                className="mt-2 mb-2 rounded-lg"
                style={{
                    width: '100%', 
                    height: '360px',
                    backgroundColor: '#fff', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    borderRadius: "10px"
                }}
            >

                        <SortedBarChart topItems={topItems} />
            </div>

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
