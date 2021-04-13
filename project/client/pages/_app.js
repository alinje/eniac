import {
  QueryClient,
  QueryClientProvider,
} from 'react-query' // importerar
import '../styles/globals.css'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  return <QueryClientProvider client={queryClient}><Component {...pageProps} /></QueryClientProvider> // wrappar med react-query, prop queryClient
}

export default MyApp
