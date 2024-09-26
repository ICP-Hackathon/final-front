import Image from "next/image";
import Link from "next/link";
import { User, Menu } from "lucide-react";
import { HeaderBarProps } from "@/utils/interface";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Header: React.FC<HeaderBarProps> = ({ title }) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // /ai/[id]/chat
  const isAIChat =
    /^\/ai\/[^/]+\/chat/.test(router.asPath) || router.asPath === "/test";

  const isMyPage = router.asPath === "/mypage";

  return (
    <header className="py-4 px-6 flex items-center justify-between">
      <div className="w-10">{/* Menu button code remains unchanged */}</div>
      <h1 className="text-xl font-semibold">{title}</h1>
      {!isMyPage && (
        <Link href="/mypage" passHref>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center cursor-pointer">
            {isMounted && user && user.profile_image_url ? (
              <Image
                src={user.profile_image_url}
                alt="User profile"
                width={40}
                height={40}
                className="w-full h-full object-cover transform scale-150 translate-y-[-10%]"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </Link>
      )}
      {isMyPage && <div className="w-10"></div>} {/* Placeholder for spacing */}
    </header>
  );
};

export default Header;
