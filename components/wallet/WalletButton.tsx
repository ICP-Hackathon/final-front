import { useEffect } from "react";
import { walletAtom } from "@/lib/states";
import { useSetAtom } from "jotai";
import { fetchUserExists, fetchUser } from "@/utils/api/user";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/userStore";
import { User } from "@/utils/interface";

function WalletButton() {
  const wallet = { address: "test", connected: true };
  const setWallet = useSetAtom(walletAtom);
  const router = useRouter();
  const { setUser, setUserWallet } = useUserStore();

  useEffect(() => {
    if (wallet.connected && wallet.address) {
      console.log("Wallet connected");
      console.log("Current wallet: ", wallet);

      setWallet(wallet);
      setUserWallet(wallet);

      const checkAndSetUser = async (address: string) => {
        try {
          const userExists = await fetchUserExists(address);

          if (userExists) {
            const userInfo = await fetchUser(address);
            const requiredProps: (keyof User)[] = [
              "user_address",
              "nickname",
              "image_url",
              "gender",
              "country",
              "interest",
            ];
            const missingProps = requiredProps.filter(
              (prop) => !(prop in userInfo)
            );

            if (missingProps.length > 0) {
              console.warn(
                `Missing user properties: ${missingProps.join(", ")}`
              );
            }

            setUser(userInfo as User);
            router.push("/explore");
          } else {
            router.push("/setprofile");
          }
        } catch (error) {
          console.error("Error checking user or fetching user info:", error);
        }
      };

      checkAndSetUser(wallet.address);
    } else {
      console.log("Wallet disconnected");
    }
  }, [
    wallet.connected,
    wallet.address,
    setWallet,
    setUserWallet,
    setUser,
    router,
  ]);

  return (
    <div style={{ width: "100%", marginBottom: 10 }}>Connect Your Wallet</div>
  );
}

export default WalletButton;
