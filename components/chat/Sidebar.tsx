import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIItem {
  id: string;
  name: string;
  imageUrl: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreSaved, setShowMoreSaved] = useState(false);
  const [showMoreHistory, setShowMoreHistory] = useState(false);

  // Mock data - replace with actual data fetching logic
  const savedAIs: AIItem[] = [
    { id: "1", name: "NearGuide", imageUrl: "/path-to-image1.jpg" },
    { id: "2", name: "AI Name", imageUrl: "/path-to-image2.jpg" },
    { id: "3", name: "AI Name", imageUrl: "/path-to-image3.jpg" },
    { id: "4", name: "AI Name 4", imageUrl: "/path-to-image4.jpg" },
  ];

  const aiHistory: AIItem[] = [
    { id: "5", name: "NearGuide", imageUrl: "/path-to-image5.jpg" },
    { id: "6", name: "AI Name", imageUrl: "/path-to-image6.jpg" },
    { id: "7", name: "AI Name", imageUrl: "/path-to-image7.jpg" },
    { id: "8", name: "AI Name 8", imageUrl: "/path-to-image8.jpg" },
  ];

  const chatHistory = [
    { id: "1", title: "Can you tell me about...", date: "today" },
    { id: "2", title: 'The term "near and...', date: "today" },
    { id: "3", title: "Can you advice on...", date: "yesterday" },
    { id: "4", title: 'The term "near and...', date: "9.12" },
    { id: "5", title: "Can you advice on...", date: "9.8" },
    { id: "6", title: "Can you tell me about...", date: "9.4" },
    { id: "7", title: "Can you tell me about...", date: "9.1" },
  ];

  const renderAIList = (items: AIItem[], showMore: boolean) => {
    const displayItems = showMore ? items : items.slice(0, 3);
    return displayItems.map((item) => (
      <div key={item.id} className="flex items-center space-x-3 py-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <span>{item.name}</span>
      </div>
    ));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] p-0 flex flex-col pt-10"
      >
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your best-fit AI"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Saved AI</h3>
              {renderAIList(savedAIs, showMoreSaved)}
              {savedAIs.length > 3 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowMoreSaved(!showMoreSaved)}
                  className="w-full mt-2 justify-start px-2 hover:bg-transparent"
                >
                  {showMoreSaved ? (
                    <ChevronUp className="size-6 text-primary-900" />
                  ) : (
                    <>
                      <ChevronDown className="mr-2 size-6 text-primary-900" />
                      More
                    </>
                  )}
                </Button>
              )}
            </div>
            <div>
              <h3 className="mb-2 font-semibold">AI History</h3>
              {renderAIList(aiHistory, showMoreHistory)}
              {aiHistory.length > 3 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowMoreHistory(!showMoreHistory)}
                  className="w-full mt-2 justify-start px-2 hover:bg-transparent"
                >
                  {showMoreHistory ? (
                    <ChevronUp className="size-6 text-primary-900" />
                  ) : (
                    <>
                      <ChevronDown className="mr-2 size-6 text-primary-900" />
                      More
                    </>
                  )}
                </Button>
              )}
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Chat History</h3>
              {chatHistory.map((chat) => (
                <div key={chat.id} className="flex justify-between py-2">
                  <span className="truncate">{chat.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {chat.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
