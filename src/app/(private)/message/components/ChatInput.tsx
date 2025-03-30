import { FormEvent, useState } from "react";
import { FaAt } from "react-icons/fa";
import { useChat } from "./chatContext";
import SendIcon from "../../../../assets/Send.svg";
import Image from "next/image";

export const ChatInput: React.FC = () => {
  const { currentChat, sendMessage } = useChat();
  const [message, setMessage] = useState("");

  const handleSendMessage = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  if (!currentChat) return null;

  return (
    <form
      onSubmit={handleSendMessage}
      className="bg-white border-t p-4 flex items-center w-full"
    >
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Send your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full pr-20 py-2 pl-4 focus:outline-none"
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