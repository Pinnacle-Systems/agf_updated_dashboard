import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { useState } from 'react';
import Sidebar from './scenes/global/Sidebar';
import LoginForm from './scenes/login/NewLogin';
import ActiveTabList from './scenes/ActiveTab';
import Topbar from './scenes/global/Topbar';
import { ColorContext } from './scenes/global/context/ColorContext';
import secureLocalStorage from 'react-secure-storage';
import { PermissionContext } from "./scenes/global/context/PermissionContext.js";
import { ToastContainer } from 'react-toastify';

function App() {
  const [theme, colorMode] = useMode();
  const [color, setColor] = useState("#CA8717")
  const [permissions, setPermissions] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('userName');
    window.location.href = '/';
  };

  
  return (
    <>
    
    <Router>
      <ColorModeContext.Provider value={colorMode}>
        <ColorContext.Provider value={{ color, setColor }}>
        {/* <PermissionContext.Provider value={{ permissions, setPermissions }}> */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route
                path="/*"
                element={
                  <div >
                    <Topbar onLogout={handleLogout} />
                    <div className='flex'>
                      <div className="flex float-left h-full side-bar w-auto">
                        <Sidebar />
                      </div>
                      <div className="bg-gray-200 float-right w-auto flex-grow">
                        <ActiveTabList />
                      </div>
                    </div>
                  </div>
                }
              />
            </Routes>
          </ThemeProvider>
          {/* </PermissionContext.Provider> */}
        </ColorContext.Provider>
      </ColorModeContext.Provider>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
