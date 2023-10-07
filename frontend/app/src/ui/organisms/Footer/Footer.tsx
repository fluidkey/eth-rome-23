import React, {useState} from 'react';
import { AppBar, Container, Box, Button, Typography, TextField } from '@mui/material';
import theme from '../../theme';
import { ArrowRightAltRounded } from '@mui/icons-material';
import supabase from '../../../utils/supabase';

export default function Footer(): JSX.Element {
  const [join, setJoin] = useState(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isValidEmail = re.test(String(emailInput).toLowerCase());
    if (isValidEmail) {
      setIsValidEmail(true);
      const { error } = await supabase.from('waitlist').insert([{ email: emailInput }]);
      if (error) {
        console.error(error);
      } else {
        setIsEmailSubmitted(true);
      }
    } else {
      setIsValidEmail(false);
    }
  }

  return (
    isEmailSubmitted ? <></> :
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'transparent !important',
        backgroundImage: 'none !important',
        boxShadow: 'none',
        zIndex: theme.zIndex.drawer + 1,
        [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        bottom: 0, 
        top: 'auto',
      }}
    >
      <Box display="flex" justifyContent="center" maxWidth="90vw" width="100%" margin="auto" mb={0}>
        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            zIndex: theme.zIndex.drawer + 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '7vh',
            maxHeight: '50px',
            minHeight: '40px',
            marginBottom: '5vh',
            paddingY: '1.5vh',
            paddingX: '16px',
            borderRadius: '10px',
            backgroundColor: 'background.paper',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          key="header"
        >
          <Box component="form" onSubmit={handleSubmit} display="flex" justifyContent="space-between" width="100%">
              {!join ?
                (
                  <Typography variant="body1">
                    Join the waitlist to get early access
                  </Typography>
                ) : (
                  <TextField
                    label=""
                    autoFocus={true}
                    variant="standard" 
                    placeholder="Your email"            
                    inputProps={{ style: { textAlign: 'center', fontWeight: 600 } }}
                    fullWidth
                    value={emailInput}
                    onChange={e => {
                      setEmailInput(e.target.value);
                    }}
                  />
                )
              }
              {!join ?
                (
                  <Button
                    color="inherit"
                    size="small"
                    variant="outlined"
                    endIcon={<ArrowRightAltRounded />}
                    sx={{
                      padding: '0px',
                      textTransform: 'none',
                      marginLeft: '8px',
                    }}
                    onClick={() => setJoin(!join)}
                  >
                    Join
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    size="small"
                    variant="outlined"
                    endIcon={<ArrowRightAltRounded />}
                    sx={{
                      padding: '0px',
                      paddingX: '18px',
                      textTransform: 'none',
                      marginLeft: '8px',
                    }}
                    type="submit"
                  >
                    Submit
                  </Button>
                )}
            </Box>
        </Container>
      </Box>
    </AppBar>
  );
}
