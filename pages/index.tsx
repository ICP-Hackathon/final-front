import Link from "next/link";
import google from "@/assets/google.png";
import Image from "next/image";
import Logo from "@/assets/logo_apptos.svg";
import { WalletSelector } from "@/components/wallet/WalletSelector";

export default function Landing() {
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
