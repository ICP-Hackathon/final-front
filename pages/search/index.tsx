import Search from "@/components/Search";
import { AICard } from "@/components/search/AICard";
import { AICardProps } from "@/utils/interface";
import CreateCustomAISheet from "@/components/MakeAI";
import { useEffect, useState } from "react";
import { CardData } from "@/utils/interface";
import { fetchAIs } from "@/utils/api/ai";
import { sliceAddress } from "@/utils/lib/address";

export default function SearchPage() {
  const [searchCards, setSearchCards] = useState<CardData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log(searchCards);
  useEffect(() => {
    const loadAIModels = async () => {
      try {
        const searchData = await fetchAIs(0, 10);
        setSearchCards(searchData.ais);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Ensure loading state is updated on error
      }
    };
    loadAIModels();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="mt-2 mb-4">
        <Search setSearch={setSearchCards} />
      </div>
      <div className="flex-grow overflow-y-auto mb-16">
        {searchCards &&
          searchCards.map((item) => <AICard key={item.id} item={item} />)}
      </div>
      <div className="fixed bottom-16 left-0 right-0 px-4 mb-4 max-w-[600px] mx-auto">
        <CreateCustomAISheet />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Search",
    },
  };
}
