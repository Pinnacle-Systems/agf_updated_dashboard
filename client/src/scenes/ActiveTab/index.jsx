import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push, remove } from "../../redux/features/opentabs";

import { CLOSE_ICON, DOUBLE_NEXT_ICON } from "../../icons";
import { useState } from "react";
import useOutsideClick from "../../CustomHooks/handleOutsideClick";
import PoRegister from "../poRegister";
import { MisDashboard } from "../../scenes"
import OrderManagement from "../OrderManagement";
import OutlinedCard from "../Users/Users";
import { ColorContext } from "../global/context/ColorContext";

const ActiveTabList = () => {
    const { color } = useContext(ColorContext);
    const openTabs = useSelector((state) => state.openTabs);
    const dispatch = useDispatch();
    const [showHidden, setShowHidden] = useState(false);

    const ref = useOutsideClick(() => { setShowHidden(false) })

    const tabs = {
        "DASHBOARD": <MisDashboard />,
        "Employees Detail": <PoRegister />,
        'Order Status': <OrderManagement />,
        "User": <OutlinedCard />,
    };

    const innerWidth = window.innerWidth;
    const itemsToShow = innerWidth / 130;
    const currentShowingTabs = openTabs.tabs.slice(0, parseInt(itemsToShow));
    const hiddenTabs = openTabs.tabs.slice(parseInt(itemsToShow));
    return (
        <div className="relative w-full h-full">
            <div className="flex justify-between ">
                <div className="flex gap-2 m-2  ">
                    {currentShowingTabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`p-1 rounded subheading-font text-xs flex justify-center gap-1`}
                            style={
                                tab.active
                                    ? { backgroundColor: color, color: "white" }
                                    : { backgroundColor: "white", color: color }
                            }
                        >
                            <button
                                onClick={() => {
                                    dispatch(push({ id: tab.id }));
                                }} className=""
                            >
                                {tab.name}
                            </button>
                            <button className="px-1 rounded-xs transition"
                                onClick={() => {
                                    dispatch(remove({ id: tab.id }));
                                }}
                            >
                                {CLOSE_ICON}
                            </button>
                        </div>
                    ))}
                </div>
                <div>
                    {(hiddenTabs.length !== 0) &&
                        <button onClick={() => setShowHidden(true)}>
                            {DOUBLE_NEXT_ICON}
                        </button>
                    }
                </div>
                {showHidden &&
                    <ul ref={ref} className="absolute right-0 top-5 bg-gray-200 z-50 p-1">
                        {hiddenTabs.map(tab =>
                            <li key={tab.id} className={`flex justify-between hover:bg-blue-200  ${tab.active ? "bg-red-300" : "bg-gray-300"
                                } `}>
                                <button className=" text-gray-500"
                                    onClick={() => {
                                        dispatch(push({ id: tab.id }));
                                    }}
                                >
                                    {tab.name}
                                </button>
                                <button className="hover:bg-red-400 px-1 rounded-xs transition"
                                    onClick={() => {
                                        dispatch(remove({ id: tab.id }));
                                    }}
                                >
                                    {CLOSE_ICON}
                                </button>
                            </li>
                        )}
                    </ul>
                }
            </div>
            {openTabs.tabs.map((tab, index) => (
                <div key={index} className={`${tab.active ? "block" : "hidden"} w-full`}>
                    {tabs[tab.name]}
                </div>
            ))}
        </div>
    );
};

export default ActiveTabList;
