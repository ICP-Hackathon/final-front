import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Plus, Camera } from "lucide-react";
import { createAI } from "@/utils/api/ai";
import { useUserStore } from "@/store/userStore";

type CategoryKey =
  | "education"
  | "health & fitness"
  | "entertainment"
  | "social networking"
  | "business"
  | "developer tools"
  | "graphics & design"
  | "others";

interface CreateCustomAISheetProps {
  onAICreated: () => void;
}

const CreateCustomAISheet: React.FC<CreateCustomAISheetProps> = ({
  onAICreated,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [introductions, setIntroductions] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  //ai 이름 띄어쓰기 변경
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.replace(/\s+/g, "_");
    setName(newName);
  };

  const handleCreate = async () => {
    setLoading(true);

    const aiData = {
      name: name,
      creator_address: user?.user_address ?? "",
      category: selectedCategory,
      introductions: introductions,
      rag_contents: data,
      rag_comments: "CreateAI",
      profile_image_url: "",
      created_at: new Date().toISOString(),
      examples: "",
    };

    try {
      const res = await createAI(aiData);
      console.log("AI Created successfully", res);
      onAICreated(); 
    } catch (error) {
      console.error("Error creating AI:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const categories: string[] = [
    "Education",
    "Health & Fitness",
    "Entertainment",
    "Social networking",
    "Business",
    "Developer tools",
    "Graphics & Design",
    "Others",
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="w-full py-4 bg-primary-50 text-primary-900 hover:bg-primary-700 rounded-full flex items-center justify-center">
          <Plus className="mr-4" size={24} />
          Create Custom AI
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[calc(100vh-4rem)] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold flex-grow text-center">
              Create Custom AI
            </h2>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <div className="flex justify-center">
              <div className="relative size-20 bg-primary-900 rounded-full overflow-hidden">
                <input
                  type="file"
                  id="ai-image"
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="ai-image"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <Plus size={32} className="text-white" />
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                AI Name
              </label>
              <input
                type="text"
                id="nickname"
                className="w-full p-2 border-b border-gray-300 focus:border-primary-900 focus:outline-none"
                placeholder="Name your AI"
                onChange={handleNameChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const categoryKey = category
                    .toLowerCase()
                    .replace(/ & /g, " ")
                    .replace(/ /g, "-") as CategoryKey;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(categoryKey)}
                      className={`px-4 py-2 rounded-full ${
                        selectedCategory === categoryKey
                          ? "bg-primary-900 text-white"
                          : "bg-white text-primary-900 border border-primary-900"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg border py-2 px-4">
                <h3 className="font-semibold mb-2 pb-2 border-b">
                  Introduction
                </h3>
                <textarea
                  placeholder="Add a short description"
                  className="w-full text-gray-600 bg-transparent resize-none focus:outline-none"
                  rows={2}
                  onChange={(e) => setIntroductions(e.target.value)}
                />
              </div>

              <div className="bg-white rounded-lg border py-2 px-4">
                <h3 className="font-semibold mb-2">Data</h3>
                <div className="space-y-2">
                  <textarea
                    placeholder="Provide things to learn"
                    className="w-full text-gray-600 bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary-900"
                    rows={3}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>
              </div>

              {/* <div className="bg-white rounded-lg border py-2 px-4">
                <h3 className="font-semibold mb-2">Examples</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Provide an example to initiate the conversation"
                    className="w-full text-gray-600 bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary-900"
                  />
                  <input
                    type="text"
                    placeholder="Click to edit"
                    className="w-full text-gray-600 bg-transparent focus:outline-none focus:border-primary-900"
                  />
                </div>
              </div> */}
            </div>
          </div>

          <div className="p-4 bg-white border-t">
            <button
              className="w-full py-4 bg-primary-50 text-primary-900 hover:bg-primary-700 rounded-full flex items-center justify-center"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCustomAISheet;
