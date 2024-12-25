import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { useState } from 'react';
import Sidebar from './scenes/global/Sidebar';
import LoginForm from './scenes/login/logIn';
import ActiveTabList from './scenes/ActiveTab';
import Topbar from './scenes/global/Topbar';
import { ColorContext } from './scenes/global/context/ColorContext';

function App() {
  const [theme, colorMode] = useMode();
  const [color, setColor] = useState("#CA8717")

  const handleLogout = () => {
    localStorage.removeItem('userName');
    window.location.href = '/';
  };

  return (
    <Router>
      <ColorModeContext.Provider value={colorMode}>
        <ColorContext.Provider value={{ color, setColor }}>
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
        </ColorContext.Provider>
      </ColorModeContext.Provider>
    </Router>
  );
}

export default App;
