import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, Typography, CircularProgress } from "@mui/material";
import Name from "../organisms/Name/Name";
import Dashboard from "../organisms/Dashboard/Dashboard";
import Footer from "../organisms/Footer/Footer";
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ADDRESS, IS_USER_REGISTERED } from '../../graphql/codegen/queries/User';
import { useEffect } from "react";
import { useSignMessage, useDisconnect } from "wagmi";


export default function Main() {
  const { address } = useAccount();
  const { signMessage, isSuccess, isError } = useSignMessage({
    message: 'Sign this message to generate your Fluidkey private payment keys. WARNING: Only sign this message within a trusted website or platform to avoid loss of funds.',
  });
  const { disconnect } = useDisconnect();

  const {data: nameSet, loading: registerLoading} = useQuery(IS_USER_REGISTERED, {
    variables: {
      address: address as string,
    }, 
    skip: !address
  });
  console.log(nameSet);

  const {data: user, loading: userLoading, refetch} = useQuery(GET_USER_BY_ADDRESS, {
    variables: {
      address: address as string,
    },
    skip: !address
  });
  console.log(user);

  useEffect(() => {
    console.log(address, isSuccess, userLoading, registerLoading, nameSet?.isUserRegistered);
    if(address && !isSuccess && !registerLoading && !nameSet?.isUserRegistered) {
      signMessage()
    }
  }, [address, registerLoading]);

  useEffect(() => {
    if(isError) {
      disconnect()
    }
  }, [isError]);

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
        user?.getUserByAddress?.username ?
        (
          <Dashboard />
        ) : (
          !userLoading && !registerLoading ?
          isSuccess ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
          >
            <Name refetch={refetch}/>
          </Box> ) :(
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
            flexDirection="column"
          >
            <CircularProgress />
            <Typography variant="body1" pt={2}>
              Sign the private payment key generation message.
            </Typography>
            </Box>
          ) : null
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
