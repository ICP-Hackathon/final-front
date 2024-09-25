import Link from "next/link";
import Logo from "@/assets/logo_apptos.svg";
import { WalletSelector } from "@/components/wallet/WalletSelector";
import { useUserStore } from "@/store/userStore";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function Landing() {
  const { clearUser } = useUserStore();
  const { disconnect } = useWallet();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Clear user data and disconnect wallet only on initial render
      clearUser();
      disconnect();
      localStorage.clear();

      setIsInitialized(true);
    }
  }, [clearUser, disconnect, isInitialized]);

  return (
    <div className="h-screen flex items-center justify-center bg-white pb-16">
      <div className="max-w-[600px] w-full mx-auto px-6">
        <Logo className="mx-auto mb-10 relative left-4" />

        <div className="w-full flex flex-col items-center mb-12">
          <div className="font-semibold text-4xl pb-3">Welcome to</div>
          <div className="font-semibold text-4xl pb-4 text-primary-900">
            ApptoS 👋
          </div>
          <div className="text-primary-900 text-center">
            You can tail me anything
          </div>
        </div>

        <WalletSelector />
        <Link
          href="https://apptosblockblock.gitbook.io/apptos"
          target="_blank"
          className="w-full bg-primary-900 text-white font-semibold py-4 rounded-full shadow-md hover:bg-primary-100 transition duration-300 ease-in-out flex items-center justify-center"
        >
          About Us
        </Link>
      </div>
    </div>
  );
}
