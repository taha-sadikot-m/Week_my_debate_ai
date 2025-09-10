import React from "react";
import VoiceChat from "../components/VoiceChat";

const STT = () => {
  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Live Conversation</h1>
      {/* Integrate voice chat here */}
      <VoiceChat />
    </div>
  );
};

export default STT;
