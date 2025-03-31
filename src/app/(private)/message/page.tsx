"use client";
import React, { useState, useEffect } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { ChatProvider } from "./components/chatContext";

export default function MessagePage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(true); // Start with sidebar visible on mobile
      } else {
        setShowSidebar(true); // Always show sidebar on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Function to toggle between sidebar and chat on mobile
  const toggleView = () => {
    if (isMobile) {
      setShowSidebar(!showSidebar);
    }
  };

  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-70px)] mt-[70px] overflow-hidden">
        {/* Chat sidebar - fixed width on desktop, full width on mobile when visible */}
        <div
          className={`${
            isMobile
              ? showSidebar
                ? "w-full fixed inset-0 z-30 mt-[70px]"
                : "hidden"
              : "w-80 min-w-80"
          } h-full flex-shrink-0 overflow-hidden border-r bg-white`}
        >
          <ChatSidebar onChatSelect={toggleView} />
        </div>

        {/* Main chat area - flexible width on desktop, full width on mobile when visible */}
        <div
          className={`${
            isMobile ? (showSidebar ? "hidden" : "w-full") : "flex-grow"
          } flex flex-col h-full overflow-hidden`}
        >
          {/* Fixed chat header with back button on mobile */}
          <div className="flex-shrink-0">
            <ChatHeader onBackClick={isMobile ? toggleView : undefined} />
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
