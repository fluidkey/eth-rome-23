import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import theme from './ui/theme';
import Main from './ui/pages/Main';

const projectId = "912700a50171dd26f221cab915984a73"

const metadata = {
  name: 'Fluidkey',
  description: 'Fluidkey',
  url: 'https://fluidkey.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'] // TODO: change logo
}

const chains = [base]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#CDEAF7',
    '--w3m-border-radius-master': '10px',
    '--w3m-font-size-master': '8px',
    '--w3m-z-index': 10000,
  }
})

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <WagmiConfig config={wagmiConfig}>
            <Routes>
              <Route path="/" element={<Main />} />
            </Routes>
          </WagmiConfig>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
