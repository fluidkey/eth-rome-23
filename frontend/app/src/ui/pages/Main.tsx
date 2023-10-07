import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, Typography } from "@mui/material";
import Name from "../organisms/Name/Name";
import Dashboard from "../organisms/Dashboard/Dashboard";
import Footer from "../organisms/Footer/Footer";

export default function Main() {
  const { address } = useAccount();
  const nameSet = true;

  return (
    <>
      <Header />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        height="88vh"
        mt="12vh"
      >
      {address ? 
        nameSet ?
        (
          <Dashboard />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
          >
            <Name />
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
          >
            <Typography variant="h6">
              Start by connecting your wallet.
            </Typography>
          </Box>
        )
      }
      </Box>
      <Footer />
    </>
  );
}
