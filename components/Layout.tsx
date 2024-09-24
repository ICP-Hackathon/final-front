import Head from "next/head";
import Header from "./Header";
import FooterBar from "./FooterBar";
import { LayoutProps } from "@/utils/interface";

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="max-w-[600px] mx-auto h-screen flex justify-center">
      <Head>
        <title>{title} | ApptoS</title>
        <meta name="description" content="AI Chat Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full flex flex-col">
        <Header title={title} />

        <main className="flex-grow overflow-y-auto px-4 scrollbar-hide">
          {children}
        </main>
        <FooterBar />
      </div>
    </div>
  );
};

export default Layout;
