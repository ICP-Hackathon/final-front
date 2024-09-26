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
  const [isMounted, setIsMounted] = useState(false); // 클라이언트에서만 렌더링되도록

  useEffect(() => {
    setIsMounted(true); // 클라이언트 사이드에서만 동작
  }, []);

  // /ai/[id]/chat
  const isAIChat =
    /^\/ai\/[^/]+\/chat/.test(router.asPath) || router.asPath === "/test";

  return (
    <header className="py-4 px-6 flex items-center justify-between">
      <div className="w-10">
        {/* {isAIChat && (
          <button
            onClick={onMenuClick}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
        )} */}
      </div>
      <h1 className="text-xl font-semibold">{title}</h1>
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
    </header>
  );
};

export default Header;
