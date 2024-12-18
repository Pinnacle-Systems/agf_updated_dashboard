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
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { push } from '../../redux/features/opentabs';
import { useGetUsersQuery } from '../../redux/service/user';
import { ColorContext } from './context/ColorContext';
import { useContext } from "react";

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: '50%',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SidebarContainer = styled(Box)(({ theme, isCollapsed }) => ({
  width: isCollapsed ? '50px' : '180px',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#F9FAFB',
  transition: 'width 0.3s ease, background-color 0.3s ease',
  height: '100vh',
  boxShadow: isCollapsed ? 'none' : '2px 0 4px rgba(0, 0, 0, 0.1)',
  paddingTop: theme.spacing(1),
}));

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const dispatch = useDispatch();
  const { data: userData } = useGetUsersQuery();
  const { color } = useContext(ColorContext); 


  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={isCollapsed ? 'center' : 'space-between'}
        p={1}
      >
        {!isCollapsed && (
          <Typography
            variant="h6"
            color="textPrimary"
            style={{
              position: 'relative',
              display: 'inline-block',
              marginLeft: '10px',
              fontWeight: '400',
            }}
          >
            BS APPARELS
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                left: '25%',
                width: '70%', 
                height: '2px',
                backgroundColor: color? color:'#C57B03',
                transform: 'translateX(-25%)',
              }}
            ></span>
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          <MenuIcon sx={{ fontSize: isCollapsed ? '18px' : '24px' }} />
        </IconButton>
      </Box>

      <List>
        <Tooltip title="Dashboard" placement="right" disableHoverListener={!isCollapsed}>
          <StyledListItemButton onClick={() => dispatch(push({ id: 1, name: 'DASHBOARD' }))}>
            <StyledListItemIcon>
              <DashboardIcon sx={{ color:color?`${color}`: '#CA8A04', fontSize: '28px', background:"white" }} />
            </StyledListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
                sx={{ ml: 1 }}
              />
            )}
          </StyledListItemButton>
        </Tooltip>

        <Tooltip title="User" placement="right" disableHoverListener={!isCollapsed}>
          <StyledListItemButton onClick={() => dispatch(push({ id: 4, name: 'User' }))}>
            <StyledListItemIcon>
              <PersonIcon sx={{ color:color?`${color}`: '#CA8A04', fontSize: '28px' , background:"white"  }} />
            </StyledListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="User"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
                sx={{ ml: 1 }}
              />
            )}
          </StyledListItemButton>
        </Tooltip>
      </List>
    </SidebarContainer>
  );
};

export default Sidebar;
