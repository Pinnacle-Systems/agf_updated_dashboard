import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { useState } from 'react'
import Sidebar from './scenes/global/Sidebar';
import LoginForm from './scenes/login/logIn';
import ActiveTabList from './scenes/ActiveTab';
import Topbar from './scenes/global/Topbar';
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    window.location.href = '/';
  };
  return (
    <Router>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route
              path="/*"
              element={
                <main className="w-screen flex h-screen">
                  <div className='flex-col '>
                    <div className='w-screen h-[8%]'><Topbar onLogout={handleLogout} /></div>
                    <div className='h-[92%] '> <div className='flex float-left w-auto h-full side-bar'>
                      <Sidebar isCollapsed={isCollapsed} />
                    </div>
                      <div className="overflow-auto w-auto h-full">
                        <ActiveTabList />
                      </div></div>
                  </div>
                </main>
              }
            />
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Router>
  );
}

export default App;
