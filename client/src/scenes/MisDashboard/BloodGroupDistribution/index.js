import React, { useState } from 'react';
import { CiMenuKebab } from 'react-icons/ci';
import { IoMdDownload } from 'react-icons/io';
import html2canvas from 'html2canvas'; // Import for capturing screenshots
import { useGetTopItemsQuery } from '../../../redux/service/poData';
import SortedBarChart from './SortedBarChart';
import CardWrapper from '../../../components/CardWrapper';
import BuyerMultiSelect from '../../../components/ModelMultiSelect1';

const BloodGrp = ({ option }) => {
    const [selected, setSelected] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showOptions, setShowOptions] = useState(false); // State for dropdown toggle
    const { data: topItem } = useGetTopItemsQuery({ filterBuyer: selected });
    const topItems = topItem?.data || [];

    // Toggle the dropdown
    const toggleOptions = () => {
        setShowOptions(prev => !prev);
    };

    // Capture and download the chart as an image
    const captureScreenshot = async () => {
        const chartElement = document.getElementById("chartBloodGroup");
        if (chartElement) {
            const canvas = await html2canvas(chartElement);
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "chart.png";
            link.click();
        }
    };

    return (
        <CardWrapper heading={"Blood Group Distribution"} onFilterClick={() => setShowModal(true)}>
            <div
                id="chartBloodGroup"
                className="relative mt-2 rounded-lg p-2"
                style={{
                    width: '100%', 
                    height: '360px',
                    backgroundColor: '#fff', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    borderRadius: "10px"
                }}
            >
                {selected && <SortedBarChart topItems={topItems} />}

                {/* Toggle Button */}
                <div className="absolute top-2 right-2">
                    <button
                        onClick={toggleOptions}
                        className="bg-gray-100 text-black p-2 rounded-lg shadow-md hover:bg-gray-200"
                    >
                        <CiMenuKebab size={18} />
                    </button>

                    {/* Options Dropdown */}
                    {showOptions && (
                        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md p-2 z-10">
                            <button
                                onClick={captureScreenshot}
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
                            >
                                <IoMdDownload className="text-lg" />
                                
                            </button>
                        </div>
                    )}
                </div>
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
    );
};

export default BloodGrp;
