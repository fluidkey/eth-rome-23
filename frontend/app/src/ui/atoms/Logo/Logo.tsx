import React from 'react';
import { Box, Link } from '@mui/material';
import { ReactComponent as Fluidkey } from '../../../content/fluidkey.svg';

interface LogoProps {
  size: string;
}

export default function Logo({ size }: LogoProps): JSX.Element {
  return (
    <Box
      sx={{
        width: size,
      }}
    >
      <Link
        href="/"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Fluidkey width="100%" />
      </Link>
    </Box>
  );
}
