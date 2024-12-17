import React, { useEffect, useState } from "react";
import { Dropdown } from 'primereact/dropdown';

export default function DropdownDt({ selected, setSelected, option }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (option) {
            const mappedOptions = option.map((item) => ({
                name: item.buyerName,
                value: item.buyerName
            }));
            setOptions(mappedOptions);
        }
    }, [option]);

    return (
        <div className="card flex justify-end items-center">
            <Dropdown
                value={selected}
                onChange={(e) => setSelected(e.value)}
                options={options}
                placeholder={`Select `}
                className="w-full"
                style={{ backgroundColor: 'white', borderRadius: '2px', width: '4.5rem', fontSize: '12px' }}
                panelClassName="dropdown-panel-black"
                optionLabel="name"
            />
        </div>
    );
}
