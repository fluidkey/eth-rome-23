import { createTheme, type ThemeOptions, lighten } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#CDEAF7',
      contrastText: '#292C34',
      light: '#E0F2FA',
      dark: '#7DCAEE',
    },
    background: {
      default: '#22242b',
      paper: '#292C34',
    },
    text: {
      primary: '#FAFDFF',
      secondary: '#A7ACB9',
      disabled: '#C6C9D2',
    },
    divider: '#3f4350',
    error: {
      main: '#ff666a',
      contrastText: '#FFA3A6',
    },
    success: {
      main: '#80ffa2',
      contrastText: '#292C34',
    },
    warning: {
      main: '#FF9A72',
      contrastText: '#292C34',
    },
  },
  typography: {
    fontFamily: 'Work Sans, Arial, sans-serif',
    fontWeightBold: 800,
    fontWeightMedium: 600,
    fontWeightRegular: 500,
    fontWeightLight: 300,
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
      '@media (max-width:600px)': {
        fontSize: '2.4rem',
      },
    },
    h3: {
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.7rem',
      },
    },
    button: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 400,
      '@media (max-width:600px)': {
        fontSize: '1.4rem',
      },
    },
    h6: {
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    body1: {
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
    },
    body2: {
      '@media (max-width:600px)': {
        fontSize: '0.8rem',
      },
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      defaultProps: {
        sx: {
          textTransform: 'none',
          fontWeight: 700,
        },
      },
      styleOverrides: {
        root: {
          '&.MuiButton-containedSuccess:hover': {
            backgroundColor: '#B3FFC7',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 'inherit !important',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
