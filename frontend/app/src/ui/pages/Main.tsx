import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, Typography } from "@mui/material";
import Name from "../organisms/Name/Name";

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
          <Name />
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
