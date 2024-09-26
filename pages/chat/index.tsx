import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Heart, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchUserChats } from "@/utils/api/chat";
import { addLike, delLike, fetchLikeList } from "@/utils/api/user";
import { sliceAddress } from "@/utils/lib/address";
import { useUserStore } from "@/store/userStore";

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
  const { user } = useUserStore();
  const [likes, setLikes] = useState(true);

  const addLikes = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user && user.user_address) {
        const userData = {
          user_address: user.user_address,
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
      if (user && user.user_address) {
        const userData = {
          user_address: user.user_address,
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
      className="p-4 bg-[#1F222A] rounded-lg flex items-center border border-[#2A2D36] hover:bg-[#2A2D36] cursor-pointer transition-all duration-200"
      onClick={() => router.push(`/ai/${aiId}/chat`)}
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
        <div className="size-[50px] rounded-full bg-primary-900 mr-4 flex items-center justify-center"></div>
      )}
      <div className="flex-1 text-left">
        <h3 className="text-sm font-semibold text-white">{ai_name}</h3>
        <p className="text-xs text-gray-400">{sliceAddress(creator)}</p>
      </div>
      {icon === Heart ? (
        likes ? (
          <Heart
            className="text-primary-900"
            color="#00D897"
            fill="#00D897"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              delLikes(e);
            }}
          />
        ) : (
          <Heart
            className="text-primary-900"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
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
        className={`w-full flex items-center justify-between p-4 bg-primary-900 bg-opacity-20 text-primary-900 rounded-xl ${
          isOpen ? "border-2 border-primary-900" : ""
        }`}
        onClick={() => setOpenDropdown(isOpen ? "" : title)}
      >
        <div className="flex-1 text-center">
          <span className="text-lg">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="ml-4 text-primary-900" size={20} />
        ) : (
          <ChevronDown className="ml-4 text-primary-900" size={20} />
        )}
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-[#1F222A] border border-[#2A2D36] shadow-lg rounded-lg z-10 max-h-[252px] overflow-y-auto">
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
  const { user } = useUserStore();

  useEffect(() => {
    const loadAIModels = async () => {
      if (user && user.user_address) {
        try {
          const ChatData = await fetchUserChats(user.user_address);
          const formattedChats = ChatData?.chats?.map((chat: any) => ({
            aiId: chat.ai.id,
            ai_name: chat.ai.name,
            creator: chat.creator,
            imageSrc: chat.ai.profile_img_url || "",
            icon: Clock,
          }));
          setChats(formattedChats || []);

          const LikeData = await fetchLikeList(user.user_address);
          const formattedLikes = LikeData?.ais?.map((like: any) => ({
            aiId: like.id,
            ai_name: like.name,
            creator: like.creator,
            imageSrc: like.profile_img_url || "",
            icon: Heart,
          }));
          setLikes(formattedLikes || []);

          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadAIModels();
  }, [user?.user_address]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#181A20] flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-6 text-center">
        <h2 className="text-xl text-gray-400 mb-6">Select one from below:</h2>
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
          <div className="w-full flex items-center justify-between p-4 bg-primary-900 bg-opacity-20 text-primary-900 rounded-xl transition-all duration-200 hover:bg-[#2A2D36]">
            <div className="flex-1 text-center">
              <span className="text-lg">Go Explore More</span>
            </div>
            <ArrowRight className="ml-4 text-primary-900" size={20} />
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
