import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchMyAIs } from "@/utils/api/ai";
import { AIModel, AIDetailProps } from "@/utils/interface";
import { useUserStore } from "@/store/userStore";

interface AIBalanceCardProps {
  name: string;
  category: string;
  imageSrc?: string;
  usage: number;
  earnings: number;
}

export const AIBalanceCard: React.FC<AIBalanceCardProps> = ({
  name,
  category,
  imageSrc,
  usage,
  earnings,
}) => {
  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {imageSrc ? (
              <Image
                src={imageSrc}
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
          <button className="text-primary-900 font-medium text-lg flex items-center">
            Collect
          </button>
        </div>

        <div className="flex mt-4 divide-x divide-gray-300">
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500">Usage</p>
            <p className="text-lg font-semibold">{usage} tokens</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500">Earnings</p>
            <p className="text-lg font-semibold">$ {earnings.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBalancePage = () => {
  const [myAIs, setMyAIs] = useState<AIDetailProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();
  useEffect(() => {
    const loadAIModels = async () => {
      if (user && user.user_address) {
        try {
          const todayData = await fetchMyAIs(user.user_address);
          setMyAIs(todayData.ais);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    };
    loadAIModels();
  }, [user?.user_address]);

  console.log(myAIs);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user?.user_address) {
    return <div>Please connect your wallet to view your balance.</div>;
  }

  const totalEarnings =
    myAIs?.reduce((sum, ai) => sum + ai.total_token_usage * 0.01, 0) || 0;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-primary-900 text-white p-4 rounded-xl mb-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-start border-r pr-2">
            <h2 className="text-xl font-semibold mr-2 mb-1">My Balance</h2>
            <span className="bg-white text-primary-900 px-4 rounded-full text-sm">
              {myAIs?.length || 0} AIs
            </span>
          </div>
          <div className="items-center mx-auto">
            <p className="text-sm text-center">Earnings</p>
            <p className="text-2xl font-semibold">
              $ {totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Overview of AIs</h2>
      {myAIs?.map((ai) => (
        <AIBalanceCard
          key={ai.id}
          name={ai.name}
          category={ai.category}
          imageSrc={ai.profile_img_url}
          usage={ai.total_token_usage}
          earnings={ai.total_token_usage * 0.01}
        />
      ))}
    </div>
  );
};

export default MyBalancePage;

export async function getStaticProps() {
  return {
    props: {
      title: "My Balance",
    },
  };
}
