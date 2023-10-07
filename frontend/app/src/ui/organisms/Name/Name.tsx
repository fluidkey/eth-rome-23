import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { uniqueNamesGenerator, colors, animals, Config } from 'unique-names-generator';
import { ArrowRightAltRounded, RefreshRounded } from "@mui/icons-material";
import FocusContainer from "../../atoms/Containers/FocusContainer";

const customConfig: Config = {
  dictionaries: [colors, animals],
  separator: '-',
  length: 2,
};

export default function Name(): JSX.Element {
  const [refresh, setRefresh] = useState(false);
  const [name, setName] = useState(uniqueNamesGenerator(customConfig));

  useEffect(() => {
    setName(uniqueNamesGenerator(customConfig));
  }, [refresh]);

  return(
    <FocusContainer>
      <Box 
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mx={3}
        mt={2}
        mb={3}
      >
        <Typography variant="h5" textAlign="center" pb={1}>
          Choose a unique name
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" pb={5}>
          This is the identifier linked to your stealth addresses.
        </Typography>
        <Typography variant="h6" alignItems="baseline" pb={7}>
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="baseline">
              <TextField
                label=""
                variant="standard" 
                placeholder={name}            
                style={{ 
                  textAlign: 'right',
                  flex: 1, 
                }}
                inputProps={{ style: { textAlign: 'center', fontWeight: 600 } }}
              />
              <Typography variant="h6">
                .fkey.eth
              </Typography>
            </Box>
            <IconButton
              children={<RefreshRounded />}
              sx={{
                marginLeft: '8px',
                color: 'text.secondary',
              }}
              onClick={() => setRefresh(!refresh)}
            />
          </Box>  
        </Typography>
        <Box display="flex" justifyContent="center">
          <Button 
            variant="contained"
            endIcon={<ArrowRightAltRounded />}
            fullWidth={false}
            sx={{
              background:
                'linear-gradient(125deg,hsl(199deg 72% 89%) 0%,hsl(194deg 80% 88%) 0%,hsl(189deg 82% 87%) 1%,hsl(184deg 79% 85%) 5%,hsl(177deg 79% 84%) 13%,hsl(170deg 85% 85%) 32%,hsl(162deg 90% 85%) 59%,hsl(152deg 95% 86%) 77%,hsl(139deg 98% 88%) 90%,hsl(120deg 100% 90%) 100%)',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Confirm name
          </Button>
        </Box>
      </Box>
    </FocusContainer>
  )
}
