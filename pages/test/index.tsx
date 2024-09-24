import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import avatarImage from "@/assets/avatar.png";
import { Message, ChatResponse } from "@/utils/interface";
import { createChat, fetchChatHistory, sendMessage } from "@/utils/api/chat";
import { Menu, Send } from "lucide-react";
import Sidebar from "@/components/chat/Sidebar";
import { Button } from "@/components/ui/button";

const AIChat = () => {
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const aiName = useMemo(() => {
  //   if (typeof id === "string") {
  //     const parts = id.split("_");
  //     return parts.length > 2 ? parts[parts.length - 1] : parts[1];
  //   }
  //   return "AI Assistant";
  // }, [id]);

  // const chatid = useMemo(() => {
  //   if (user && id) {
  //     return `${user.userid}_${id}`;
  //   }
  //   return null;
  // }, [id, user]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // useEffect(() => {
  //   if (chatid && user) {
  //     initializeChat();
  //   }
  // }, [chatid, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const initializeChat = async () => {
  //   if (!chatid || !user) return;

  //   try {
  //     const chatHistory = await fetchChatHistory(chatid, user.userid);
  //     if (chatHistory.length === 0) {
  //       await createChat({ aiid: id as string, userid: user.userid });
  //       const welcomeMessage: Message = {
  //         role: "ai",
  //         content: "Hello! How can I assist you?",
  //         timestamp: new Date().toISOString(),
  //       };
  //       setMessages([welcomeMessage]);
  //       await sendMessage(chatid, welcomeMessage.content, aiName);
  //     } else {
  //       setMessages(chatHistory);
  //     }
  //   } catch (error) {
  //     console.error("Error initializing chat:", error);
  //   }
  // };

  const handleSendMessage = async () => {
    // if (!input.trim() || !user || !chatid) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // const response = await sendMessage(chatid, input, user.userid);
      // const aiMessage: Message = {
      //   role: "ai",
      //   content: response.message,
      //   timestamp: response.createdat,
      // };
      // setMessages((prevMessages) => [...prevMessages, aiMessage]);
      console.log(messages);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </Button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-16 left-0 right-0 px-4 mb-4 max-w-[600px] mx-auto">
        <div className="flex items-center space-x-2">
          <div className="flex-grow bg-gray-100 rounded-lg px-5 py-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.nativeEvent.isComposing &&
                handleSendMessage()
              }
              placeholder="Type your message..."
              className="w-full bg-transparent outline-none"
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="bg-primary-900 text-white rounded-full p-4 shadow shadow-green-200"
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

export async function getServerSideProps() {
  return {
    props: {
      title: "AI Chat",
    },
  };
}
