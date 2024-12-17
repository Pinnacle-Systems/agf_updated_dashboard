import React, { useState, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { push } from '../../redux/features/opentabs';
import { useGetUsersQuery } from '../../redux/service/user';

const StyledListItemIcon = styled(ListItemIcon)(({ theme, isCollapsed }) => ({
  minWidth: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  border: '1px solid #D3D3D3',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, isCollapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  position: 'relative',
  '&:hover .menu-text': {
    opacity: 1,
  },
}));

const SidebarContainer = styled(Box)(({ theme, isCollapsed }) => ({
  width:'60px',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#2C2C2C' : '#F4F4F4',
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: 'width 0.3s ease, background-color 0.3s ease',
  height: '100vh',
  boxShadow: isCollapsed ? 'none' : '2px 0 4px rgba(0, 0, 0, 0.1)',
}));

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { data: userData } = useGetUsersQuery();
  const storedUsername = localStorage.getItem('userName');

  const currentUser = useMemo(() => {
    return userData?.data?.find((user) => user.userName === storedUsername);
  }, [userData, storedUsername]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
    <List>
      <StyledListItemButton onClick={() => dispatch(push({ id: 1, name: 'DASHBOARD' }))} isCollapsed={isCollapsed}>
        <StyledListItemIcon isCollapsed={isCollapsed}>
          <DashboardIcon sx={{ color: '#CA8A04' }} />
        </StyledListItemIcon>
        <ListItemText
          className="menu-text"
          primary="Dashboard"
          sx={{
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease',
            marginLeft: '10px',
            color: '#F3F4F6',
            display: 'inline-block',
            '&:hover': {
              opacity: 1, // Text appears on hover, even when collapsed
            },
          }}
        />
      </StyledListItemButton>
  
      <StyledListItemButton onClick={() => dispatch(push({ id: 4, name: 'User' }))} isCollapsed={isCollapsed}>
        <StyledListItemIcon isCollapsed={isCollapsed}>
          <PersonIcon sx={{ color: '#CA8A04' }} />
        </StyledListItemIcon>
        <ListItemText
          className="menu-text"
          primary="User"
          sx={{
            opacity: isCollapsed ? 0 : 1, 
            transition: 'opacity 0.3s ease',
            marginLeft: '10px',
            color: '#F3F4F6',
            display: 'inline-block',
            '&:hover': {
              opacity: 1, 
            },
          }}
        />
      </StyledListItemButton>
    </List>
  </SidebarContainer>
  
  );
};

export default Sidebar;
