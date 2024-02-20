import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './layout'
import Template from './template'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Template>
        <Component {...pageProps} />
      </Template>
    </Layout>
  )
}
