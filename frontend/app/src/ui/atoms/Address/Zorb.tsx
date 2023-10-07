import React, { useMemo } from 'react';
import { zorbImageDataURI } from '@zoralabs/zorb';

export const Zorb = ({ address }: { address: `0x${string}` }): JSX.Element => {
  if (address === undefined) {
    return <></>;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const zorbImage = useMemo(() => zorbImageDataURI(address), [address]);
  return <img src={zorbImage} />;
};
