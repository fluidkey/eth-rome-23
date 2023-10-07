import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, Typography } from "@mui/material";
import Name from "../organisms/Name/Name";
import Dashboard from "../organisms/Dashboard/Dashboard";
import Footer from "../organisms/Footer/Footer";
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ADDRESS, IS_USER_REGISTERED } from '../../graphql/codegen/queries/User';
import { REGISTER_USER, SET_USERNAME } from '../../graphql/codegen/mutations/User';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { useEffect } from 'react';
import { useGetPayments } from '../../hooks/useGetPayments';

export default function Main() {
  const { address } = useAccount();
  const nameSet = true;

  // const payments = useGetPayments({
  //   address: '0x4879FAC3b088B54A9efd084b6f87fCeC538D94BF',
  //   pause: false,
  //   intervalInSeconds: 5
  // });
  // console.log('payments Returned', payments.payments, payments.loading);

  // const {data} = useQuery(IS_USER_REGISTERED, {
  //   variables: {
  //     address: '0x44C19105f358BAb85f8E9FDA9202A1326A714d84',
  //   }
  // });
  // console.log(data);

  // const [registerUser, {}] = useMutation(REGISTER_USER, {
  //   variables: {
  //     registerUserInput: {
  //       address: '0x477c458FB24B43101Dd11ccd1671Cff79C511fdC',
  //       spendingPubKey: privateKeyToAccount(generatePrivateKey()).publicKey,
  //       viewingPubKey: privateKeyToAccount(generatePrivateKey()).publicKey,
  //     }
  //   }
  // });
  // useEffect(() => {
  //   registerUser().then((res) => {
  //     console.log(res);
  //   });
  // }, []);

  // const [setUsername, {}] = useMutation(SET_USERNAME, {
  //   variables: {
  //     address: '0x4879FAC3b088B54A9efd084b6f87fCeC538D94BF',
  //     username: 'random321',
  //   }
  // });
  // useEffect(() => {
  //   setUsername().then((res) => {
  //     console.log(res);
  //   });
  // }, []);

  // const {data} = useQuery(GET_USER_BY_ADDRESS, {
  //   variables: {
  //     address: '0x44C19105f358BAb85f8E9FDA9202A1326A714d84'
  //   }
  // });
  // console.log(data);

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
