import { useUserStore } from "@/store/userStore";
import { addLike, delLike } from "@/utils/api/user";
import { Heart } from "lucide-react";
import { useState } from "react";

interface CardProps {
  ai_id: string;
  name: string;
  creator: string;
  like: boolean;
}

const Card: React.FC<CardProps> = ({ name, creator, ai_id, like }) => {
  const { user } = useUserStore();
  const [likes, setLikes] = useState(like);

  const addLikes = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user && user.user_address) {
        const userData = {
          user_address: user.user_address,
          ai_id: ai_id,
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
          ai_id: ai_id,
        };
        await delLike(userData);
        setLikes(false);
      }
    } catch (error) {
      window.alert("Fail to Like AI");
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md relative h-[160px] flex flex-col">
      <div className="bg-primary-900 rounded-md size-14 mb-4"></div>
      <div className="flex-grow flex flex-col justify-between">
      <h3 className="text-sm font-semibold min-h-[20px] overflow-hidden text-ellipsis whitespace-nowrap">{name}</h3>
      <p className="text-xs text-gray-500 min-h-[16px]">{creator}</p>
      </div>
      <button className="absolute top-2 right-2 text-gray-700">
        {likes ? (
          <>
            <Heart
              color="#F75555"
              fill="#F75555"
              size={16}
              onClick={delLikes}
            />
          </>
        ) : (
          <Heart color="#9E9E9E" size={16} onClick={addLikes} />
        )}
      </button>
    </div>
  );
};

export default Card;
