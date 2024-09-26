import { Key } from "react";
import { DialogContent } from "@/components/ui/dialog";
import { CardData } from "@/utils/interface";
import { useRouter } from "next/router";
import { getDate } from "@/utils/lib/date";
import { txScanURL } from "@/utils/lib/txscan";

interface AIDetailsPropWithName {
  ai_detail: CardData;
}

const AIDetailsPopup: React.FC<AIDetailsPropWithName> = ({
  ai_detail,
}: AIDetailsPropWithName) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/ai/${ai_detail.id}/chat`);
  };

  return (
    <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-visible flex flex-col">
      <div className="px-6 pt-6 pb-3 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex justify-center pt-5">
            <div className="inline-block px-3 py-1 bg-primary-50 text-primary-900 rounded-full text-sm">
              {ai_detail.category}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-900 text-center break-words">
            {ai_detail.name}
          </h2>
          <p className="text-gray-500 text-center">
            Created by {ai_detail.creator}
          </p>
          <p className="text-gray-500 text-center">
            Average Token Usage:
            <span className="text-black font-bold ml-1">
              {Math.round(
                ai_detail.total_token_usage / (ai_detail.chat_count || 1)
              )}
            </span>
          </p>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-700 text-sm text-center">
              {ai_detail.introductions}
            </p>
          </div>
          <div className="bg-white border-gray-200 border rounded-2xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-700 border-b">RAG</h3>
            {ai_detail.rags.length > 0
              ? ai_detail.rags.map(
                  (rag: any, index: Key | null | undefined) => (
                    <div key={index}>
                      <div className="flex place-content-between">
                        <p className="text-sm text-gray-900 font-regular">
                          {rag.comments}
                        </p>
                        <p className="bg-primary-50 text-primary-900 font-medium text-[12px] w-[40px] rounded-2xl text-center">
                          {getDate(rag.created_at)}
                        </p>
                      </div>
                      <a
                        className="text-gray-500 text-[10px] break-all"
                        href={txScanURL(rag.tx_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {txScanURL(rag.tx_url)}
                      </a>
                    </div>
                  )
                )
              : "No RAG information available."}
          </div>

          <div className="bg-white rounded-2xl">
            <h3 className="font-semibold text-gray-700 border-b">Examples</h3>
            {ai_detail.examples ? (
              <p className="mt-2 bg-gray-50 p-3 rounded-2xl text-gray-700 text-sm text-center">
                {ai_detail.examples}
              </p>
            ) : (
              <p className="mt-2 bg-gray-50 p-3 rounded-2xl text-gray-700 text-sm text-center">
                No example provided
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 border-t mt-auto">
        <button
          className="w-full py-4 bg-primary-900 text-white font-bold text-[18px] hover:bg-primary-700 rounded-full flex items-center justify-center focus:outline-none"
          onClick={handleClick}
        >
          Start a Chat!
        </button>
      </div>
    </DialogContent>
  );
};

export default AIDetailsPopup;
