import { useRouter } from "next/router";
import Link from "next/link";
import { LayoutGrid, Search, MessageCircle, Wallet } from "lucide-react";

const FooterBar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Explore", icon: LayoutGrid, path: "/explore" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Chat", icon: MessageCircle, path: "/chat" },
    { name: "My Balance", icon: Wallet, path: "/mybalance" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-[600px] w-full mx-auto">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.path;
          return (
            <Link href={item.path} key={item.name}>
              <div className="flex flex-col items-center">
                <item.icon
                  className={`w-6 h-6 ${
                    isActive ? "text-primary-900" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "text-primary-900 font-medium" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FooterBar;
