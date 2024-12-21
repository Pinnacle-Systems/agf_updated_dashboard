
import React from 'react'
import { useState } from 'react';
import DropdownCom from '../Ui Component/modelParam';
import { SelectedBuyer } from '../scenes/global/context/ColorContext';
const ModelMultiSelect = ( selectedBuyer,
  setSelectedBuyer,
  color,
 ) => {
    const [showModel, setShowModel] = useState(false);

    const handleArrowClick = () => {
      setShowModel(prevState => !prevState);
    };
  return (
    <div>
    
<div>
<div
  className={`arrow-button bg-white hover:bg-gray-100 shadow-lg rounded-lg mr- px-3 py-1 flex items-center justify-center ${
    showModel ? 'translate-x-[-220px]' : ''
  }`}
  onClick={handleArrowClick}
  style={{
    position: 'absolute',
    top: '5px',
    right: '15px',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    cursor: 'pointer',
  }}
>
  <span
    className="text-gray-600 text-2xl transition-transform duration-300"
    style={{ color: color ? `${color}` : '#4B5563' }}
  >
    {showModel ? '❮' : '❯'}
  </span>
</div>


<div
  className={`model-box ${showModel ? 'open' : 'closed'}`}
  style={{
    position: 'absolute',
    top: '0',
    right: showModel ? '0' : '-220px',
    width: '220px',
    height: '48vh', 
    backgroundColor: '#f9f9f9',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
    transition: 'right 0.3s ease',
    borderRadius: '8px 0 0 8px',
    zIndex: "20"
  }}
>
  <div
    className="model-content"
    style={{
      padding: '20px',
      overflowY: 'auto',
      height: '100%',
    }}
  >
    <DropdownCom
      selectedBuyer={selectedBuyer}
      setSelectedBuyer={setSelectedBuyer}
       columnHeaderHeight="20"
    />
  </div>
</div>

    </div>
    </div>
  )
}

export default ModelMultiSelect