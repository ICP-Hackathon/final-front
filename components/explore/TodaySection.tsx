import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Card from "./Card";
import AIDetailsPopup from "./AIDetailsPopup";
import { CardData } from "@/utils/interface";
import { sliceAddress } from "@/utils/lib/address";
import { useState } from "react";

interface TodaySectionProps {
  isLoading: boolean;
  todayCards: CardData[] | null;
  setSelectedAI: (ai: CardData | null) => void;
}

const TodaySection: React.FC<TodaySectionProps> = ({
  isLoading,
  todayCards,
  setSelectedAI,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-6 scrollbar-hide">
      <h2 className="text-lg font-bold mb-4">Today</h2>
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          todayCards?.map((item: CardData) => (
            <Dialog
              key={item.id}
              onOpenChange={(open) => {
                setIsOpen(open);
                setSelectedAI(open ? item : null);
              }}
            >
              <DialogTrigger asChild>
                <div>
                  <Card
                    ai_id={item.id}
                    name={item.name}
                    category={item.category}
                    like={item.like}
                  />
                </div>
              </DialogTrigger>
              {isOpen && (
                <DialogContent>
                  <AIDetailsPopup ai_detail={item} />
                </DialogContent>
              )}
            </Dialog>
          ))
        )}
      </div>
    </section>
  );
};

export default TodaySection;
