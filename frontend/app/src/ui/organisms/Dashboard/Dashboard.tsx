import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { LaunchRounded } from "@mui/icons-material";
import CompressedAddress from "../../atoms/Address/CompressedAddress";

export default function Dashboard(): JSX.Element {
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
  );
}