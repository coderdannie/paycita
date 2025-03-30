"use client";
import React from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { ChatProvider } from "./components/chatContext";

export default function MessagePage() {
  return (
    <ChatProvider>
      {/* Make the chat container fill the available space in the dashboard */}
      <div className="flex h-[calc(100vh-70px)] mt-[70px] overflow-hidden">
        {/* Chat sidebar - fixed width */}
        <div className="w-80 min-w-80 h-full flex-shrink-0 overflow-hidden border-r">
          <ChatSidebar />
        </div>
        
        {/* Main chat area - flexible width */}
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          {/* Fixed chat header */}
          <div className="flex-shrink-0">
            <ChatHeader />
          </div>
          
          {/* Scrollable messages area - takes remaining height */}
          <div className="flex-grow overflow-y-auto">
            <ChatMessages />
          </div>
          
          {/* Fixed chat input at bottom */}
          <div className="flex-shrink-0">
            <ChatInput />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}