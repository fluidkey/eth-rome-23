import React, { useEffect, useState } from "react";
import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { uniqueNamesGenerator, colors, animals, Config } from 'unique-names-generator';
import { RefreshRounded } from "@mui/icons-material";

const customConfig: Config = {
  dictionaries: [colors, animals],
  separator: '-',
  length: 2,
};

export default function Main() {
  const { address } = useAccount();
  const [refresh, setRefresh] = useState(false);
  const [name, setName] = useState(uniqueNamesGenerator(customConfig));

  useEffect(() => {
    setName(uniqueNamesGenerator(customConfig));
  }, [refresh]);

  return (
    <>
      <Header />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="90vh"
      >
      {address ? 
        (
          <Box 
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography variant="body1" textAlign="center">
              Choose a unique name.
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" pb={6}>
              This is the identifier linked to your stealth addresses.
            </Typography>
            <Typography variant="h6" alignItems="baseline">
              <Box display="flex" alignItems="center">
                <Box display="flex" alignItems="baseline">
                  <TextField
                    label=""
                    variant="standard" 
                    placeholder={name}            
                    style={{ 
                      textAlign: 'right',
                      flex: 1, 
                      width: '250px'
                    }}
                    inputProps={{ style: { textAlign: 'center', fontWeight: 600 } }}
                  />
                  <Typography variant="h6">
                    .fkey.eth
                  </Typography>
                </Box>
                <IconButton
                  children={<RefreshRounded />}
                  sx={{
                    marginLeft: '8px',
                  }}
                  onClick={() => setRefresh(!refresh)}
                />
              </Box>  
            </Typography>
          </Box>
        ) : (
          <Typography variant="h6">
            Start by connecting your wallet.
          </Typography>
        )
      }
      </Box>
    </>
  );
}
