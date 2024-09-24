import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { Message, ChatResponse } from "@/utils/interface";
import { createChat, fetchChatHistory, sendMessage } from "@/utils/api/chat";
import { Send } from "lucide-react";
import Logo from "@/assets/logo_apptos.svg";

const AIChat = () => {
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wallet = { address: "test" };

  const chatId = useMemo(() => {
    if (wallet.address && id) {
      return `${wallet.address}_${id}`;
    }
    return null;
  }, [id, wallet.address]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId && wallet.address) {
      initializeChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    if (!chatId || !wallet.address) return;

    try {
      const chatHistory = await fetchChatHistory(chatId, wallet.address);
      console.log(chatHistory);
      if (chatHistory.length === 0) {
        await createChat({ ai_id: id as string, user_address: wallet.address });
        // Add initial AI message
        const initialMessage: Message = {
          role: "ai",
          content: "Hello! How can I assist you?",
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMessage]);
      } else {
        setMessages(chatHistory);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !wallet.address || !chatId) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(chatId, input, wallet.address);
      const aiMessage: Message = {
        role: "ai",
        content: response.message,
        timestamp: response.created_at,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
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
    <div className="flex flex-col h-full -mx-4">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 pb-32">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "ai" && (
              <div className="mr-2 mb-2 flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <Logo className="" />
                </div>
              </div>
            )}
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary-900 text-white"
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
      <div className="fixed bottom-16 left-0 right-0 bg-white">
        <div className="max-w-[600px] mx-auto px-3 py-3">
          <div className="flex items-center space-x-2">
            <div className="flex-grow bg-gray-100 rounded-lg px-5 py-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
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
