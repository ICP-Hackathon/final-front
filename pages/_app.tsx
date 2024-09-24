import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { Provider as JotaiProvider } from "jotai";

type PageComponentProps = {
  title: string;
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const PageComponent = Component as React.ComponentType<PageComponentProps>;

  // Check if the current route is the landing page
  const isLandingPage = router.pathname === "/";
  const isSetProfilePage = router.pathname === "/setprofile";

  if (isLandingPage || isSetProfilePage) {
    return (
      <JotaiProvider>
        <PageComponent {...pageProps} />
      </JotaiProvider>
    );
  }
  return (
    <JotaiProvider>
      <Layout title={pageProps.title || "Near and Dear"}>
        <PageComponent {...pageProps} />
      </Layout>
    </JotaiProvider>
  );
}

export default MyApp;
