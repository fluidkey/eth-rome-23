import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { LaunchRounded } from "@mui/icons-material";
import CompressedAddress from "../../atoms/Address/CompressedAddress";
import { useGetPayments } from "../../../hooks/useGetPayments";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ADDRESS } from "../../../graphql/codegen/queries/User";
import { useEffect, useState } from "react";

export default function Dashboard(): JSX.Element {
  const { address } = useAccount();
  const [total, setTotal] = useState(0);
  const { payments, loading } = useGetPayments({
    address: address as string,
    intervalInSeconds: 5,
  });

  const {data: user, loading: userLoading} = useQuery(GET_USER_BY_ADDRESS, {
    variables: {
      address: address as string,
    },
    skip: !address
  });

  useEffect(() => {
    if(payments.length > 0) {
      let amounts = [];
      for (let i = 0; i < payments.length; i++) {
        const subAmount = parseFloat(payments[i].amount);
        amounts.push(subAmount);
      }
      const total = amounts.reduce((a, b) => a + b, 0).toFixed(6);
      const final = parseFloat(total);
      setTotal(final);
    }
  }, [payments]);


  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      width="90vw"
      maxWidth="sm"
      py={4}
      px={3}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box ml="16px">
          <Typography variant="body2" color="text.secondary">
            Your private address
          </Typography>
          <Typography variant="h6" mb={4}>
            {user?.getUserByAddress?.username ? user?.getUserByAddress?.username + ".fkey.eth" : null }
          </Typography>
        </Box>
        <Box mr="16px" display="flex" flexDirection="column" justifyContent="right">
          <Typography variant="body2" color="text.secondary" align="right">
            Balance
          </Typography>
          <Typography variant="h6" mb={4}>
            {total} ETH
          </Typography>
        </Box>
      </Box>
      {payments.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography variant="body2" color="text.secondary">
            No payments yet
          </Typography>
        </Box>
      ) : (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "text.secondary" }}>Amount</TableCell>
              <TableCell sx={{ color: "text.secondary" }}>From</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody> 
            {payments.map((payment) => (
              <TableRow key={payment.thHash}>
                <TableCell>{payment.amount} ETH</TableCell>
                <TableCell><CompressedAddress address={payment.from as `0x${string}`} characters={12} /></TableCell>
                <TableCell align="right">
                  <Box component="span" display="inline-flex" alignItems="baseline">
                    <Link
                      alignItems="baseline"
                      underline="none"
                      sx={{
                        color: "primary.dark",
                        "&:hover": {
                          cursor: "pointer",
                          color: "primary.main",
                        },
                      }}
                      href={`https://basescan.org/tx/${payment.thHash}`}
                      target="_blank"
                    >
                      Basescan <LaunchRounded style={{ fontSize: "inherit", verticalAlign: "text-top" }} />
                    </Link>
                  </Box>
                </TableCell>
              </TableRow>
            ))}         
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </Box>
  );
}