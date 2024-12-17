import { useContext } from 'react';
import * as React from 'react';
import { useTheme } from '@mui/material';
import { ColorModeContext, tokens } from '../../theme';
import { MdLogout } from "react-icons/md";
import { useDispatch } from 'react-redux';
import logo from '../../assets/l.png';

const Topbar = ({ onLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();

  return (
    <div className="flex h-14">
      <div className="bg-[#1F2937] w-1/2 flex items-center px-4">
        <img
          src={logo}
          alt="user-profile"
          className="w-44 cursor-pointer"
        />
      </div>

      {/* Yellow Section */}
      <div className="bg-[#544FC5] w-1/2 flex justify-between items-center px-4 text-white">
        <div className="text-xl font-semibold">Management Information Dashboard</div>
        <button
          onClick={onLogout}
          className="text-white hover:text-gray-300 text-2xl focus:outline-none"
        >
          <MdLogout />
        </button>
      </div>
    </div>  
  );
};

export default Topbar;
