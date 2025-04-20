import { useState } from "react";
import { FaAt } from "react-icons/fa";

import SendIcon from "../../../../assets/Send.svg";
import Image from "next/image";
import { useComposeChat } from "@/src/hooks/chat/useChatQuery";
import { useDashboard } from "@/src/context/dashboardContext";

export const ChatInput = () => {
  const { currentChat, sendMessage } = useDashboard();
  const [message, setMessage] = useState("");

  const { mutate: mutateComposeMessage } = useComposeChat();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    const payload = {
      chat_id: currentChat?.chat_id,
      message: message,
    };
    if (message.trim()) {
      mutateComposeMessage(payload, {
        onSuccess: () => {
          sendMessage(message);
          setMessage("");
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  };

  if (!currentChat) return null;

  return (
    <form
      onSubmit={handleSendMessage}
      className="bg-white border-t p-2 sm:p-4 flex items-center w-full"
    >
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Send your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full pr-16 py-2 pl-3 sm:pl-4  focus:outline-none"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
          <FaAt className="text-gray-400 mr-2" />
          <button
            type="submit"
            className="text-white hover:text-purple-800 bg-[#692E9F] py-1 px-1 rounded-[.3rem]"
          >
            <Image
              src={SendIcon}
              height={24}
              width={24}
              alt="Send"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </button>
        </div>
      </div>
    </form>
  );
};
