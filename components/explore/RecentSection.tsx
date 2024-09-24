import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Card from "./Card";
import AIDetailsPopup from "./AIDetailsPopup";
import { CardData } from "@/utils/interface";
import { sliceAddress } from "@/utils/lib/address";

interface RecentSectionProps {
  title: string;
  trendCards: CardData[] | null;
  setSelectedAI: (ai: CardData | null) => void;
}

const RecentSection: React.FC<RecentSectionProps> = ({
  title,
  trendCards,
  setSelectedAI,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {trendCards?.map((item: CardData) => (
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
                  creator={item.creator}
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
        ))}
      </div>
    </section>
  );
};

export default RecentSection;
