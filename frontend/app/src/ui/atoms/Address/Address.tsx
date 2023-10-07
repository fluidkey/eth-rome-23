import React from 'react';
import { Box } from '@mui/material';
import { Zorb } from './Zorb';
import CompressedAddress from './CompressedAddress';

interface AddressProps {
  address: `0x${string}`;
  onClick?: () => void;
  sx?: Record<string, unknown>;
  characters?: number;
}

export default function Address({
  address,
  onClick,
  sx,
  characters = 6,
}: AddressProps): JSX.Element {
  return (
    <Box>
      <Box
        onClick={onClick}
        sx={{
          cursor: onClick === undefined ? 'inherit' : 'pointer',
          ...sx,
          textTransform: 'none',
          color: 'text.primary',
          '&.Mui-disabled': {
            ...sx,
            color: 'text.primary',
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{
            ...sx,
          }}
        >
          <Box height="1.2em" width="1.2em" mr="4px">
            <Zorb address={address} />
          </Box>
          <CompressedAddress address={address} characters={characters} />
        </Box>
      </Box>
    </Box>
  );
}
