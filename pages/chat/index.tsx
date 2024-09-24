import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Heart, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchUserChats } from "@/utils/api/chat";
import { addLike, delLike, fetchLikeList } from "@/utils/api/user";
import { sliceAddress } from "@/utils/lib/address";

interface AICardProps {
  aiId: string;
  ai_name: string;
  creator: string;
  imageSrc?: string;
  icon: React.FC<any>;
}

interface DropdownMenuProps {
  title: string;
  icon: string;
  items: AICardProps[];
  isOpen: boolean;
  setOpenDropdown: (title: string) => void;
}

const AICard: React.FC<AICardProps> = ({
  aiId,
  ai_name,
  creator,
  imageSrc,
  icon,
}) => {
  const router = useRouter();

  const wallet = { address: "test" };
  const [likes, setLikes] = useState(true);

  const addLikes = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (wallet.address) {
        const userData = {
          //zklogin에서 user_address 받아오기Ï
          user_address: wallet.address,
          ai_id: aiId,
        };
        await addLike(userData);
        setLikes(true);
      }
    } catch (error) {
      window.alert("Fail to Like AI");
    }
  };

  const delLikes = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (wallet.address) {
        const userData = {
          //zklogin에서 user_address 받아오기Ï
          user_address: wallet.address,
          ai_id: aiId,
        };
        await delLike(userData);
        setLikes(false);
      }
    } catch (error) {
      window.alert("Fail to Like AI");
    }
  };

  return (
    <div
      className="p-4 bg-white rounded-lg flex items-center border hover:bg-gray-100 cursor-pointer transition-all duration-200"
      onClick={() => router.push(`/ai/${aiId}/chat`)} // 전체 div 클릭 시 라우팅
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={ai_name}
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
      ) : (
        <div className="w-[50px] h-[50px] rounded-full bg-primary-900 mr-4 flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {ai_name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex-1 text-left">
        <h3 className="text-sm font-semibold">{ai_name}</h3>
        <p className="text-xs text-gray-500">{sliceAddress(creator)}</p>
      </div>
      {icon === Heart ? (
        likes ? (
          <Heart
            className="text-primary-900"
            color="#F75555"
            fill="#F75555"
            size={20}
            onClick={(e) => {
              e.stopPropagation(); // Heart 클릭 시 라우팅 중지
              delLikes(e); // Likes 함수 실행
            }}
          />
        ) : (
          <Heart
            className="text-primary-900"
            size={20}
            onClick={(e) => {
              e.stopPropagation(); // Heart 클릭 시 라우팅 중지
              addLikes(e);
            }}
          />
        )
      ) : (
        <Clock className="text-primary-900" size={20} />
      )}
    </div>
  );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title,
  icon: Icon,
  items,
  isOpen,
  setOpenDropdown,
}) => {
  return (
    <div className="relative mb-4">
      <button
        className="w-full flex items-center justify-between p-4 bg-primary-50 text-primary-900 rounded-xl transition-all duration-200"
        onClick={() => setOpenDropdown(isOpen ? "" : title)}
      >
        <div className="flex-1 text-center">
          <span className="text-lg">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="ml-4 text-primary-500" size={20} />
        ) : (
          <ChevronDown className="ml-4 text-primary-500" size={20} />
        )}
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg z-10 max-h-[252px] overflow-y-auto">
          {items.map((item, index) => (
            <AICard key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [chats, setChats] = useState<AICardProps[]>([]);
  const [likes, setLikes] = useState<AICardProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const wallet = { address: "test" };

  useEffect(() => {
    const loadAIModels = async () => {
      if (wallet.address) {
        try {
          const ChatData = await fetchUserChats(wallet?.address); // API 호출 경로와 내보내기 확인
          const formattedChats = ChatData?.chats?.map((chat: any) => ({
            aiId: chat.ai.id,
            ai_name: chat.ai.name,
            creator: chat.creator,
            imageSrc: chat.ai.profile_img_url || "", // optional 속성 처리
            icon: Clock, // 적절한 기본 아이콘 설정
          }));
          console.log(formattedChats);
          setChats(formattedChats || []); // 데이터가 없을 때 빈 배열

          const LikeData = await fetchLikeList(wallet?.address);
          const formattedLikes = LikeData?.ais?.map((like: any) => ({
            aiId: like.id,
            ai_name: like.name,
            creator: like.creator,
            imageSrc: like.profile_img_url || "", // optional 속성 처리
            icon: Heart, // 적절한 기본 아이콘 설정
          }));
          setLikes(formattedLikes || []); // 데이터가 없을 때 빈 배열

          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadAIModels();
  }, [wallet]);
  return (
    <div className="min-h-[calc(100vh-140px)] bg-white flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-6 text-center">
        <h2 className="text-xl text-gray-500 mb-6">Select one from below:</h2>
        <DropdownMenu
          title="Choose from Saved AI"
          icon={"Heart"}
          items={likes}
          isOpen={openDropdown === "Choose from Saved AI"}
          setOpenDropdown={setOpenDropdown}
        />
        <DropdownMenu
          title="See AI History"
          icon={"Clock"}
          items={chats}
          isOpen={openDropdown === "See AI History"}
          setOpenDropdown={setOpenDropdown}
        />
        <Link href="/explore" passHref>
          <div className="w-full flex items-center justify-between p-4 bg-primary-50 text-primary-900 rounded-xl transition-all duration-200 hover:bg-gray-100">
            <div className="flex-1 text-center">
              <span className="text-lg">Go Explore More</span>
            </div>
            <ArrowRight className="ml-4 text-primary-500" size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ChatPage;

export async function getStaticProps() {
  return {
    props: {
      title: "ApptoS Chat",
    },
  };
}
