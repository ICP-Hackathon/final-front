import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { WalletProvider } from "@/components/wallet/WalletProvider";

type PageComponentProps = {
  title: string;
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const PageComponent = Component as React.ComponentType<PageComponentProps>;

  const isLandingPage = router.pathname === "/";
  const isSetProfilePage = router.pathname === "/setprofile";

  if (isLandingPage || isSetProfilePage) {
    return (
      <WalletProvider>
        <PageComponent {...pageProps} />
      </WalletProvider>
    );
  }

  return (
    <WalletProvider>
      <Layout title={pageProps.title || "Near and Dear"}>
        <PageComponent {...pageProps} />
      </Layout>
    </WalletProvider>
  );
}

export default MyApp;
