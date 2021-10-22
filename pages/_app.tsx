// import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
export default MyApp;
