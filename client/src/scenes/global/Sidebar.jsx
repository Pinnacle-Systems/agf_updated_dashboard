import React, { useState, useMemo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { ExpandLess, ExpandMore, Pages } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import { FaDatabase, FaMoneyBill } from "react-icons/fa";
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
import { useDispatch, useSelector } from 'react-redux';
import { push } from '../../redux/features/opentabs';
import { useGetUsersQuery } from '../../redux/service/user';
import { ColorContext } from './context/ColorContext';
import { useContext } from "react";
import ActiveTabList from '../ActiveTab';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import { Item } from 'devextreme-react/cjs/funnel';
import { PermissionContext } from "./context/PermissionContext";
const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#E5E7EB', // <-- updated color here
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
  paddingLeft: "5px"
}));

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  // const openTabs = useSelector((state) => state.openTabs);
  const [openERP, setOpenERP] = useState(false);
  const dispatch = useDispatch();
  const { data: userData } = useGetUsersQuery();
  const { color } = useContext(ColorContext);
  const { setPermissions } = useContext(PermissionContext);
  const [isSuperAdmin,setIssuperAdmin]=useState(false)
  const [allowpages, setallowpages] = useState([])
  const [role, setRole] = useState("")
  const openTabs = useSelector((state) => {
  // console.log("Redux state:", state);
  return state.openTabs;
});
const [openMenu, setOpenMenu] = useState({});

const handleToggle = (menuKey) => {
  setOpenMenu((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
};


  async function Fliter() {
    const userId = secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "userId"
    );
    const userId1 = secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "roleId"
    );
    const isSuperAdmin = secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "superAdmin"
    );
    setIssuperAdmin(isSuperAdmin)
    const result = await axios.get("http://192.168.1.61:9008/role/getuserpages", { params: { userId } })
    setallowpages(result.data)
    const result1 =await axios.get("http://192.168.1.61:9008/role/get")
    const Rolename = result1.data.find(item => item.id === userId1)?.rolename;
    setRole(Rolename);

 }
  useEffect(() => {
    Fliter()
  }, [])

  const permissionMap = {};
  allowpages.forEach((p) => {
    permissionMap[p.link] = {
      read: p.read,
      create: p.create,
      edit: p.edit,
      delete: p.delete,
    };
  });
  setPermissions(permissionMap);
  console.log(isSuperAdmin);
  

  

  return (
    <SidebarContainer>
  <List className="">
    {isSuperAdmin == true && (

    <>      
      <Tooltip title="PayRoll" placement="right" disableHoverListener={!isCollapsed}>
          <StyledListItemButton onClick={() => dispatch(push({ id: 1, name: 'Dashboard' }))}>
            <StyledListItemIcon>
            <DashboardIcon sx={{ color: color ? `${color}` : '#CA8A04', fontSize: '28px', background: "white" }} />
           </StyledListItemIcon>
        {/* {!isCollapsed && ( */}
        <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{
                fontSize: '0.8rem',
                fontWeight: '500',
              }}
              sx={{ ml: 1 }}
            />
            {/* )} */}
          </StyledListItemButton>
        </Tooltip>
        <Tooltip title="ERP" placement="right" disableHoverListener={!isCollapsed}>
          <StyledListItemButton onClick={() => dispatch(push({ id: 2, name: 'ERP' }))}>
            <StyledListItemIcon>
              <FaDatabase
                style={{
                  color: color || '#CA8A04',
                  fontSize: '20px',
                  background: 'white',
                }}
              />
            </StyledListItemIcon>
            {/* {!isCollapsed && ( */}
            <ListItemText
              primary="ERP"
              primaryTypographyProps={{
                fontSize: '0.8rem',
                fontWeight: 500,
              }}
              sx={{ ml: 1 }}
            />
            {/* )} */}
          </StyledListItemButton>
        </Tooltip>
            {/*   already uncomment
        <Tooltip title="User" placement="right" disableHoverListener={!isCollapsed}>
        <StyledListItemButton onClick={() => dispatch(push({ id: 4, name: 'User' }))}>
          <StyledListItemIcon>
            <PersonIcon sx={{ color: color ? `${color}` : '#CA8A04', fontSize: '28px', background: "white" }} />
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
        </Tooltip> */}
        <Tooltip title="User" placement="right" disableHoverListener={!isCollapsed}>
          <>
            <StyledListItemButton onClick={() => setOpenERP(!openERP)}>
              <StyledListItemIcon>
                <FaDatabase
                  style={{
                    color: color || '#CA8A04',
                    fontSize: '20px',
                    background: 'white',
                  }}
                />
              </StyledListItemIcon>
              <ListItemText
                primary="User Management"
                primaryTypographyProps={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                }}
                sx={{ ml: 1 }}
              />
              {openERP ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>

            {/* Dropdown (collapsible) items */}
            <Collapse in={openERP} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <StyledListItemButton
                  sx={{ pl: 6 }}
                  onClick={() => dispatch(push({ id: 4, name: 'User' }))}
                >
                  <ListItemText primary="User"
                    primaryTypographyProps={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  />
                </StyledListItemButton>

                <StyledListItemButton
                  sx={{ pl: 6 }}
                  onClick={() => dispatch(push({ id: 5, name: 'Roles' }))}
                >
                  <ListItemText primary="Roles"
                    primaryTypographyProps={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }} />
                </StyledListItemButton>
                {/* <StyledListItemButton
                  sx={{ pl: 6 }}
                  onClick={() => dispatch(push({ id: 6, name: 'UserCompany' }))}
                >
                  <ListItemText primary="Company Allocation"
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }} />
                </StyledListItemButton> */}

                {/* <StyledListItemButton
          sx={{ pl: 6 }}
          onClick={() => dispatch(push({ id: 23, name: 'ERP Settings' }))}
        >
          <ListItemText primary="ERP Settings" />
        </StyledListItemButton> */}
              </List>
            </Collapse>
          </>
        </Tooltip>

        <Tooltip title="Main Dashborad" placement="right" disableHoverListener={!isCollapsed}>
          <StyledListItemButton onClick={() => dispatch(push({ id: 7, name: 'Main' }))}>
            <StyledListItemIcon>
              <PersonIcon sx={{ color: color ? `${color}` : '#CA8A04', fontSize: '28px', background: "white" }} />
            </StyledListItemIcon>
            {/* {!isCollapsed && ( */}
            <ListItemText
              primary="Main Dashboard"
              primaryTypographyProps={{
                fontSize: '0.8rem',
                fontWeight: '500',
              }}
              sx={{ ml: 1 }}
            />
            {/* )} */}
          </StyledListItemButton>
        </Tooltip>
      
</>  
      )
     }


    {/* ✅ Show default User Management section only for Admin */}
    {role === "Admin" && (
      <Tooltip title="User" placement="right" disableHoverListener={!isCollapsed}>
        <>
          <StyledListItemButton onClick={() => setOpenERP(!openERP)}>
            <StyledListItemIcon>
              <FaDatabase
                style={{
                  color: color || "#CA8A04",
                  fontSize: "20px",
                  background: "white",
                }}
              />
            </StyledListItemIcon>
            <ListItemText
              primary="User Management"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
              sx={{ ml: 1 }}
            />
            {openERP ? <ExpandLess /> : <ExpandMore />}
          </StyledListItemButton>

          {/* Sub-menu items */}
          <Collapse in={openERP} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledListItemButton
                sx={{ pl: 6 }}
                onClick={() => dispatch(push({ id: 4, name: "User" }))}
              >
                <ListItemText
                  primary="User"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                />
              </StyledListItemButton>

              <StyledListItemButton
                sx={{ pl: 6 }}
                onClick={() => dispatch(push({ id: 5, name: "Roles" }))}
              >
                <ListItemText
                  primary="Roles & Allocation"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                />
              </StyledListItemButton>
            </List>
          </Collapse>
        </>
      </Tooltip>
    )}

    {/* ✅ Render dynamic pages for all users */}
    {allowpages.map((page) => (
      <Tooltip
        key={page.id}
        title={page.link}
        placement="right"
        disableHoverListener={!isCollapsed}
      >
        <StyledListItemButton
          onClick={() => dispatch(push({ id: page.id, name: page.link }))}
        >
          <StyledListItemIcon>
            {page.link === "Dashboard" && <DashboardIcon sx={{ color }} />}
            {page.link === "ERP" && <FaDatabase style={{ color }} />}
            {page.link === "User" && <PersonIcon sx={{ color }} />}
            {page.link === "Main" && <PersonIcon sx={{ color }} />}
          </StyledListItemIcon>

          <ListItemText
            primary={page.link}
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
            sx={{ ml: 1 }}
          />
        </StyledListItemButton>
      </Tooltip>
    ))}
    
  

  
    
  </List>
</SidebarContainer>

    // <SidebarContainer >
    //   <List className="mt-3">
    //     <Tooltip title="PayRoll" placement="right" disableHoverListener={!isCollapsed}>
    //       <StyledListItemButton onClick={() => dispatch(push({ id: 1, name: 'Dashboard' }))}>
    //         <StyledListItemIcon>
    //           <DashboardIcon sx={{ color: color ? `${color}` : '#CA8A04', fontSize: '28px', background: "white" }} />
    //         </StyledListItemIcon>
    //         {/* {!isCollapsed && ( */}
    //         <ListItemText
    //           primary="Dashboard"
    //           primaryTypographyProps={{
    //             fontSize: '0.875rem',
    //             fontWeight: '500',
    //           }}
    //           sx={{ ml: 1 }}
    //         />
    //         {/* )} */}
    //       </StyledListItemButton>
    //     </Tooltip>
    //     <Tooltip title="ERP" placement="right" disableHoverListener={!isCollapsed}>
    //       <StyledListItemButton onClick={() => dispatch(push({ id: 2, name: 'ERP' }))}>
    //         <StyledListItemIcon>
    //           <FaDatabase
    //             style={{
    //               color: color || '#CA8A04',
    //               fontSize: '20px',
    //               background: 'white',
    //             }}
    //           />
    //         </StyledListItemIcon>
    //         {/* {!isCollapsed && ( */}
    //         <ListItemText
    //           primary="ERP"
    //           primaryTypographyProps={{
    //             fontSize: '0.875rem',
    //             fontWeight: 500,
    //           }}
    //           sx={{ ml: 1 }}
    //         />
    //         {/* )} */}
    //       </StyledListItemButton>
    //     </Tooltip>
    //         {/*   already uncomment
    //     <Tooltip title="User" placement="right" disableHoverListener={!isCollapsed}>
    //     <StyledListItemButton onClick={() => dispatch(push({ id: 4, name: 'User' }))}>
    //       <StyledListItemIcon>
    //         <PersonIcon sx={{ color: color ? `${color}` : '#CA8A04', fontSize: '28px', background: "white" }} />
    //       </StyledListItemIcon>
    //       {!isCollapsed && (
    //       <ListItemText
    //         primary="User"
    //         primaryTypographyProps={{
    //           fontSize: '0.875rem',
    //           fontWeight: '500',
    //         }}
    //         sx={{ ml: 1 }}
    //       />
    //        )} 
    //     </StyledListItemButton>
    //     </Tooltip> */}
    //     <Tooltip title="User" placement="right" disableHoverListener={!isCollapsed}>
    //       <>
    //         <StyledListItemButton onClick={() => setOpenERP(!openERP)}>
    //           <StyledListItemIcon>
    //             <FaDatabase
    //               style={{
    //                 color: color || '#CA8A04',
    //                 fontSize: '20px',
    //                 background: 'white',
    //               }}
    //             />
    //           </StyledListItemIcon>
    //           <ListItemText
    //             primary="User Management"
    //             primaryTypographyProps={{
    //               fontSize: '0.875rem',
    //               fontWeight: 500,
    //             }}
    //             sx={{ ml: 1 }}
    //           />
    //           {openERP ? <ExpandLess /> : <ExpandMore />}
    //         </StyledListItemButton>

    //         {/* Dropdown (collapsible) items */}
    //         <Collapse in={openERP} timeout="auto" unmountOnExit>
    //           <List component="div" disablePadding>
    //             <StyledListItemButton
    //               sx={{ pl: 6 }}
    //               onClick={() => dispatch(push({ id: 4, name: 'User' }))}
    //             >
    //               <ListItemText primary="User"
    //                 primaryTypographyProps={{
    //                   fontSize: '0.875rem',
    //                   fontWeight: 500,
    //                 }}
    //               />
    //             </StyledListItemButton>

    //             <StyledListItemButton
    //               sx={{ pl: 6 }}
    //               onClick={() => dispatch(push({ id: 5, name: 'Roles' }))}
    //             >
    //               <ListItemText primary="Roles & Allocation"
    //                 primaryTypographyProps={{
    //                   fontSize: '0.875rem',
    //                   fontWeight: 500,
    //                 }} />
    //             </StyledListItemButton>

    //             {/* <StyledListItemButton
    //       sx={{ pl: 6 }}
    //       onClick={() => dispatch(push({ id: 23, name: 'ERP Settings' }))}
    //     >
    //       <ListItemText primary="ERP Settings" />
    //     </StyledListItemButton> */}
    //           </List>
    //         </Collapse>
    //       </>
    //     </Tooltip>

    //     <Tooltip title="Main Dashborad" placement="right" disableHoverListener={!isCollapsed}>
    //       <StyledListItemButton onClick={() => dispatch(push({ id: 6, name: 'Main' }))}>
    //         <StyledListItemIcon>
    //           <PersonIcon sx={{ color: color ? `${color}` : '#CA8A04', fontSize: '28px', background: "white" }} />
    //         </StyledListItemIcon>
    //         {/* {!isCollapsed && ( */}
    //         <ListItemText
    //           primary="Main Dashboard"
    //           primaryTypographyProps={{
    //             fontSize: '0.875rem',
    //             fontWeight: '500',
    //           }}
    //           sx={{ ml: 1 }}
    //         />
    //         {/* )} */}
    //       </StyledListItemButton>
    //     </Tooltip>
    //   </List>
    // </SidebarContainer>
  );
};

export default Sidebar;
