import React from 'react';
import { Box } from '@mui/material';
import { useEnsName } from 'wagmi';

interface CompressedAddressProps {
  address: `0x${string}` | `${string}.eth`;
  marginBottom?: number;
  characters?: number;
}

export default function CompressedAddress({
  address,
  marginBottom,
  characters = 8,
}: CompressedAddressProps): JSX.Element {
  let formattedAddress = address;

  const { data } = useEnsName({
    address: address as `0x${string}`,
  });

  if (data != null) {
    formattedAddress = data as `${string}.eth`;
  }

  return formattedAddress.length > 30 ? (
    characters < 42 ? (
      <Box component="span" marginBottom={marginBottom}>
        {formattedAddress.slice(0, characters / 2 + 2)}...
        {formattedAddress.slice(-characters / 2)}
      </Box>
    ) : (
      <Box component="span" marginBottom={marginBottom}>
        {formattedAddress}
      </Box>
    )
  ) : (
    <Box component="span" marginBottom={marginBottom}>
      {formattedAddress}
    </Box>
  );
}
