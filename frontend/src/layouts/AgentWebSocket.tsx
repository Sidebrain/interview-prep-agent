import AgentConfig from "@/components/AgentConfig";
import useWebSocket from "@/hooks/useWebSocket";
import axiosClient from "@/services/axiosClient";
import { WebSocketActionMessages } from "@/types/socketTypes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type AgentConfigType = {
  //
  god: { system_prompt: string };
  candidate: { system_prompt: string };
  interviewer: { system_prompt: string; critique_prompt: string };
};

const AgentWebSocket = () => {
  const { sendMessage, closeSocket, messages, isConnected } = useWebSocket(
    import.meta.env.VITE_WEBSOCKET_URL,
  );
  const [showCritique, setShowCritique] = useState(false);
  const [showAgentConfig, setShowAgentConfig] = useState(false);
  const { data, isSuccess } = useQuery({
    queryKey: ["agentConfig"],
    queryFn: async () => {
      const respopnse =
        await axiosClient.get<AgentConfigType>("/v3/agent-config");
      return respopnse.data;
    },
  });

  const ButtonTray = () => (
    <div className="sticky top-1 flex w-screen justify-center">
      {isConnected ? (
        <div className="mt-4 h-4 w-4 rounded-full bg-green-500" />
      ) : (
        <div className="mt-4 h-4 w-4 rounded-full bg-red-500" />
      )}
      <button
        className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        onClick={() => sendMessage()}
      >
        Ping
      </button>
      <button
        className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        onClick={() => sendMessage(WebSocketActionMessages.RESET)}
      >
        Reset
      </button>
      <button
        className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        onClick={() => sendMessage(WebSocketActionMessages.NEXT)}
      >
        Next
      </button>
      <button
        className="m-2 rounded-sm bg-slate-300 px-2 py-1"
        onClick={closeSocket}
      >
        Close Socket
      </button>
      <button
        className="m-2 rounded-sm bg-slate-700 px-2 py-1 text-white"
        onClick={() => setShowCritique(!showCritique)}
      >
        Show Critique
      </button>
      <button
        className="m-2 rounded-sm bg-slate-900 px-2 py-1 text-white"
        onClick={() => setShowAgentConfig(!showAgentConfig)}
      >
        Show Agent Config
      </button>
    </div>
  );

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

  const AgentConfigComponent = () =>
    showAgentConfig &&
    isSuccess && (
      <div className="items-top absolute top-16 z-10 flex h-4/5 w-2/3 justify-center overflow-scroll border-4 border-slate-900 bg-white p-4">
        <AgentConfig {...data} />
      </div>
    );

  return (
    <div className="relative flex h-screen flex-col items-center gap-4 text-sm">
      <ButtonTray />
      <AgentConfigComponent />
      <div className="mx-2 flex gap-4">
        <Messages />
        <Critque />
      </div>
    </div>
  );
};

export default AgentWebSocket;
