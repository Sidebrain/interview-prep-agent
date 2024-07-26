import AgentConfigComponent from "@/components/AgentConfigComponent";
import WebsocketButtonTray from "@/components/WebsocketButtonTray";
import useWebSocket from "@/hooks/useWebSocket";
import { useState } from "react";

const AgentWebSocket = () => {
  const { userId, sendMessage, closeSocket, messages, isConnected } =
    useWebSocket(import.meta.env.VITE_WEBSOCKET_URL);
  const [showCritique, setShowCritique] = useState(false);
  const [showAgentConfig, setShowAgentConfig] = useState(false);
  console.log("userId", userId);

  const Messages = () => (
    <div className="relative flex h-screen w-2/3 flex-col items-center gap-4 text-sm">
      {messages
        .filter((msg) => msg.timelineOwner === "god")
        .map((msg, idx) => (
          <div
            key={idx}
            className={`mx-4 flex w-full whitespace-pre-wrap rounded-md ${msg.role === "interviewer" ? "bg-slate-100" : "bg-slate-500 text-slate-100"} p-4 shadow-md`}
          >
            {msg.content}
          </div>
        ))
        .reverse()}
    </div>
  );

  const Critque = () =>
    showCritique && (
      <div
        hidden={!showCritique}
        className="relative flex h-screen w-1/3 flex-col items-center gap-4 bg-slate-700 text-sm text-white"
      >
        <p className="mt-2 text-lg">Critique</p>
        {showCritique &&
          messages
            .filter((msg) => msg.timelineOwner === "interviewer")
            .map((msg, idx) => (
              <div
                key={idx}
                className={`mx-4 flex w-full whitespace-pre-wrap bg-slate-800 p-4 text-white`}
              >
                {msg.content}
              </div>
            ))
            .reverse()}
      </div>
    );

  return (
    <div className="relative flex h-screen flex-col items-center gap-4 text-sm">
      <WebsocketButtonTray
        closeSocket={closeSocket}
        sendMessage={sendMessage}
        setShowCritique={setShowCritique}
        showAgentConfig={showAgentConfig}
        showCritique={showCritique}
        isConnected={isConnected}
        setShowAgentConfig={setShowAgentConfig}
      />
      {showAgentConfig && (
        <AgentConfigComponent
          userId={userId}
          sendMessage={sendMessage}
          setShowAgentConfig={setShowAgentConfig}
        />
      )}
      <div className="mx-2 flex gap-4">
        <Messages />
        <Critque />
      </div>
    </div>
  );
};

export default AgentWebSocket;
