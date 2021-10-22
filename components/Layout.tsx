import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/system/Box';
import { styled } from '@mui/material/styles';
import React, { FC } from 'react';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  margin: theme.spacing(1),
}));

export type LayoutProps = {};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} minHeight="10vh">
          <Item>Head</Item>
        </Grid>
        <Grid
          item
          md={2}
          minHeight="80vh"
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
          }}
        >
          <Item>Sidebar</Item>
          <Item>Sidebar</Item>
          <Item>Sidebar</Item>
          <Item>Sidebar</Item>
        </Grid>
        <Grid item xs={12} md={10} minHeight="80vh">
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
