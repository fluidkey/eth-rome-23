import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, Typography } from "@mui/material";
import Name from "../organisms/Name/Name";
import Dashboard from "../organisms/Dashboard/Dashboard";
import Footer from "../organisms/Footer/Footer";
import { useQuery } from '@apollo/client';
import { IS_USER_REGISTERED } from '../../graphql/codegen/queries/User';

export default function Main() {
  const { address } = useAccount();
  const nameSet = true;

  const {data} = useQuery(IS_USER_REGISTERED, {
    variables: {
      address: '0x74C19105f358BAb85f8E9FDA9202A1326A714d89',
    }
  });

  console.log(data);

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
