import Search from "@/components/Search";
import { AICard } from "@/components/search/AICard";
import CreateCustomAISheet from "@/components/MakeAI";
import { useEffect, useState, useCallback } from "react";
import { CardData } from "@/utils/interface";
import { fetchAIs } from "@/utils/api/ai";
import { ArrowDownUp } from "lucide-react";

export default function SearchPage() {
  const [searchCards, setSearchCards] = useState<CardData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAIModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchData = await fetchAIs(0, 10);
      setSearchCards(searchData.ais);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAIModels();
  }, [loadAIModels]);

  return (
    <div className="flex flex-col h-full">
      <div className="mt-2 mb-4">
        <Search setSearch={setSearchCards} />
      </div>
      <div className="flex justify-end px-4 mb-2">
        <button className="text-[#00D897] flex items-center">
          <ArrowDownUp size={16} className="mr-1" />
          Sort by
        </button>
      </div>
      <div className="flex-grow overflow-y-auto mb-16">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          searchCards &&
          searchCards.map((item) => <AICard key={item.id} item={item} />)
        )}
      </div>
      <div className="fixed bottom-16 left-0 right-0 px-4 mb-4 max-w-[600px] mx-auto">
        <CreateCustomAISheet onAICreated={loadAIModels} />
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
