
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as OfferIcon,
  AssignmentReturn as ReturnIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  Public as WorldIcon,
  Inventory as InventoryIcon,
  Star as StarIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

import { Link } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#1a2233',
  color: '#fff',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: theme.spacing(7),
  backgroundColor: '#1a2233',
  color: '#fff',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const menuItems = [
  {
    category: 'Main',
    items: [
      { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboards/ProductManager' }
    ]
  },
  {
    category: 'Data',
    items: [
      { title: 'Products', icon: <InventoryIcon />, path: '/dashboards/ProductManager/products' },
      { title: 'Reviews', icon: <StarIcon />, path: '/dashboards/ProductManager/reviews' },
      { title: 'Categories', icon: <CategoryIcon />, path: '/dashboards/ProductManager/categories' },
      { title: 'Orders', icon: <ReceiptIcon />, path: '/dashboards/ProductManager/orders' },
    ]
  }
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState('Dashboard');

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader>
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pl: 2
        }}>
          {open && (
            <Typography variant="h6" component="div" sx={{ color: '#fff' }}>
              Dashboard
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </DrawerHeader>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      {menuItems.map((category) => (
        <React.Fragment key={category.category}>
          {open && (
            <Typography
              variant="caption"
              sx={{
                px: 3,
                py: 1.5,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase'
              }}
            >
              {category.category}
            </Typography>
          )}
          <List>
            {category.items.map((item) => (
              <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    }
                  }}
                  selected={selected === item.title}
                  onClick={() => setSelected(item.title)}
                  component={Link}
                  to={item.path}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title} 
                    sx={{ 
                      opacity: open ? 1 : 0,
                      '& .MuiListItemText-primary': {
                        color: '#fff'
                      }
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        </React.Fragment>
      ))}
    </StyledDrawer>
  );
};

export default Sidebar;



