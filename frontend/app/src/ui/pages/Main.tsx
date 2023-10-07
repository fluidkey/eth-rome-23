import Header from "../organisms/Header/Header";
import { useAccount } from "wagmi";
import { Box, Typography, Table, TableContainer, TableBody, TableRow, TableCell, TableHead, Link } from "@mui/material";
import Name from "../organisms/Name/Name";
import CompressedAddress from "../atoms/Address/CompressedAddress";
import { LaunchRounded } from "@mui/icons-material";

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
              <Box ml="16px">
                <Typography variant="body2" color="text.secondary">
                  Your private address
                </Typography>
                <Typography variant="h6" mb={4}>
                  user.fkey.eth
                </Typography>
              </Box>
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
                    <TableRow>
                      <TableCell>0.002 ETH</TableCell>
                      <TableCell><CompressedAddress address="0xb250c202310da0b15b82E985a30179e74f414457" characters={12} /></TableCell>
                      <TableCell>
                        <Box component="span" display="inline-flex" alignItems="baseline">
                          <Link 
                            alignItems="baseline" 
                            underline="none"
                            sx={{
                              color: 'primary.dark',
                              "&:hover": {
                                cursor: 'pointer',
                                color: 'primary.main',
                              },
                            }}
                          >
                            Basescan <LaunchRounded style={{ fontSize: 'inherit', verticalAlign: 'text-top' }} />
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>0.00102 ETH</TableCell>
                      <TableCell>0xFb2...401</TableCell>
                      <TableCell>Basescan</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
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
    </>
  );
}
