import React from 'react';
import { Box, Container } from '@mui/material';

interface FocusContainerProps {
  children: React.ReactNode;
}

export default function FocusContainer({ children }: FocusContainerProps): JSX.Element {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        bgcolor="background.paper"
        borderRadius="10px"
        boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
        py={4}
        px={3}
        component="div"
        position="fixed"
        top="initial"
        maxWidth="90vw"
      >
        {children}
      </Box>
    </Container>
  );
}
