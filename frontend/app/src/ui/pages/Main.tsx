import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, Typography } from "@mui/material";
import Name from "../organisms/Name/Name";
import Dashboard from "../organisms/Dashboard/Dashboard";
import Footer from "../organisms/Footer/Footer";
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ADDRESS, IS_USER_REGISTERED } from '../../graphql/codegen/queries/User';


export default function Main() {
  const { address } = useAccount();

  const {data: nameSet, loading} = useQuery(IS_USER_REGISTERED, {
    variables: {
      address: address as string,
    }, 
    skip: !address
  });
  console.log(nameSet);

  const {data: user} = useQuery(GET_USER_BY_ADDRESS, {
    variables: {
      address: address as string,
    },
    skip: !address
  });
  console.log(user);

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
        nameSet && user?.getUserByAddress?.username ?
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
