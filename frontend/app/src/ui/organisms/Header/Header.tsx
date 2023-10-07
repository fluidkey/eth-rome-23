import React from 'react';
import { AppBar, Container, Box, Button } from '@mui/material';
import theme from '../../theme';
import Logo from '../../atoms/Logo/Logo';
import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function Header(): JSX.Element {
  const { open } = useWeb3Modal()

  return (
    <AppBar
      position="fixed"
      sx={{
        backdropFilter: 'blur(5px)',
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
            marginTop: '1.5vh',
            paddingY: '1.5vh',
            paddingX: '16px',
            borderRadius: '10px',
            backgroundColor: 'background.paper',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          key="header"
        >
          <Box display="flex" alignItems="center">
            <Logo size="80px" />
          </Box>
          <Button 
            variant="contained"
            color="primary"
            size="small"
            onClick={() => open()}
          >
            Connect
          </Button>
        </Container>
      </Box>
    </AppBar>
  );
}
