import React from "react";
import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, TextField, Typography } from "@mui/material";

export default function Main() {
  const { address } = useAccount();

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
          <TextField
            variant="standard"
          />
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
