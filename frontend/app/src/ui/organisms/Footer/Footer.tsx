import React from 'react';
import { AppBar, Container, Box, Button, Typography, TextField } from '@mui/material';
import theme from '../../theme';
import { ArrowRightAltRounded } from '@mui/icons-material';

export default function Footer(): JSX.Element {

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'transparent !important',
        backgroundImage: 'none !important',
        boxShadow: 'none',
        zIndex: theme.zIndex.drawer + 1,
        [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        bottom: 0, 
        top: 'auto',
      }}
    >
      <Box display="flex" justifyContent="center" maxWidth="90vw" width="100%" margin="auto" mb={0}>
        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            zIndex: theme.zIndex.drawer + 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '7vh',
            maxHeight: '50px',
            minHeight: '40px',
            marginBottom: '5vh',
            paddingY: '1.5vh',
            paddingX: '16px',
            borderRadius: '10px',
            backgroundColor: 'background.paper',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          key="header"
        >
          <Typography variant="body1">
            Join the waitlist to get early access
          </Typography>
          <TextField
            label=""
            variant="standard" 
            placeholder="Your email"            
            style={{ 
              textAlign: 'right',
              flex: 1, 
            }}
            inputProps={{ style: { textAlign: 'center', fontWeight: 600 } }}
          />
          <Button
            color="inherit"
            size="small"
            variant="outlined"
            endIcon={<ArrowRightAltRounded />}
            sx={{
              padding: '0px',
              textTransform: 'none',
              marginLeft: '8px',
            }}
          >
            Join
          </Button>
        </Container>
      </Box>
    </AppBar>
  );
}
