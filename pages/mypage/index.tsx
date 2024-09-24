import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, ChevronRight, UserRound } from "lucide-react";
import Link from "next/link";

import { useUserStore } from "@/store/userStore";
import { fetchUser } from "@/utils/api/user";
import { fetchMyAIs } from "@/utils/api/ai";

interface AICardProps {
  id: string;
  name: string;
  category: string;
  profile_image_url?: string;
  introductions: string;
}
// AICard Component
const AICard: React.FC<AICardProps> = ({
  id,
  name,
  category,
  profile_image_url,
  introductions,
}) => {
  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {profile_image_url ? (
            <Image
              src={profile_image_url}
              alt={name}
              width={60}
              height={60}
              className="rounded-full mr-4"
            />
          ) : (
            <div className="size-[60px] rounded-full bg-emerald-100 mr-4 flex items-center justify-center">
              <span className="text-emerald-500 font-bold text-lg">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <span className="text-sm rounded-full bg-primary-50 text-primary-900 px-3 py-1">
              {category}
            </span>
          </div>
        </div>
        <Link
          href={`/ai/${id}/edit`}
          className="text-primary-900 font-medium text-lg flex items-center"
        >
          Edit AI
        </Link>
      </div>
    </div>
  );
};

// MyPage Component
const MyPage = () => {
  const [myAIs, setMyAIs] = useState<AICardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: storedUser, setUser } = useUserStore();
  const wallet = { address: "test" };

  const loadUserData = async () => {
    if (wallet.address) {
      try {
        const userData = await fetchUser(wallet.address);
        console.log("Fetched User Data:", userData);
        setUser(userData);
        return userData;
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data.");
      }
    }
  };

  const loadMyAIs = async () => {
    if (wallet.address) {
      try {
        const aisData = await fetchMyAIs(wallet.address);
        setMyAIs(aisData.ais);
      } catch (error) {
        console.error("Error fetching AI data:", error);
        setError("Error fetching AI data.");
      }
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      let user = storedUser;
      if (!user && wallet.address) {
        user = await loadUserData();
      }
      if (user) {
        await loadMyAIs();
      }
      setIsLoading(false);
    };

    initializeData();
  }, [wallet.address]);

  useEffect(() => {
    if (storedUser) {
      loadMyAIs();
      setIsLoading(false);
    }
  }, [storedUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!storedUser) {
    return <div>User not found. Please connect your wallet.</div>;
  }

  console.log(myAIs);
  return (
    <div className="flex flex-col px-2">
      <div className="flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center">
          <div className="size-20 bg-gray-200 rounded-full mr-4 mx-auto flex items-center justify-center overflow-hidden">
            {storedUser.image_url ? (
              <img
                src={storedUser.image_url}
                alt="Selected profile"
                className="w-full h-full object-cover transform scale-150 translate-y-[-10%]"
              />
            ) : (
              <UserRound className="text-gray-400 size-16" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{storedUser.nickname}</h2>
            <p className="text-gray-600">Gender: {storedUser.gender || ""}</p>
            <p className="text-gray-600">Country: {storedUser.country || ""}</p>
          </div>
        </div>
        <Link
          href="/editprofile"
          className="font-medium text-lg text-primary-900"
        >
          Edit <Pencil className="inline-block ml-1" size={18} />
        </Link>
      </div>

      <h3 className="text-xl font-semibold py-2">My AI</h3>
      <div>
        {myAIs.length > 0 ? (
          myAIs.map((ai) => <AICard key={ai.id} {...ai} />)
        ) : (
          <p>You haven&apos;t created any AIs yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyPage;

export async function getStaticProps() {
  return {
    props: {
      title: "My Page",
    },
  };
}
