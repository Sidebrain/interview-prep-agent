import useWebSocket from "@/hooks/useWebSocket";
import { WebSocketActionMessages } from "@/types/socketTypes";
import { useState } from "react";

const AgentWebSocket = () => {
  const { sendMessage, closeSocket, messages, isConnected } = useWebSocket(
    "ws://localhost:8000/v3/ws",
  );
  const [showCritique, setShowCritique] = useState(false);
  return (
    <div className="relative flex h-screen flex-col items-center gap-4 text-sm">
      <div className="sticky top-1 flex w-screen justify-center">
        {isConnected ? (
          <div className="mt-4 h-4 w-4 rounded-full bg-green-500" />
        ) : (
          <div className="mt-4 h-4 w-4 rounded-full bg-red-500" />
        )}
        <button
          className="m-2 rounded-sm bg-blue-300 px-2 py-1"
          onClick={() => sendMessage()}
        >
          Ping
        </button>
        <button
          className="m-2 rounded-sm bg-blue-300 px-2 py-1"
          onClick={() => sendMessage(WebSocketActionMessages.RESET)}
        >
          Reset
        </button>
        <button
          className="m-2 rounded-sm bg-blue-300 px-2 py-1"
          onClick={() => sendMessage(WebSocketActionMessages.NEXT)}
        >
          Next
        </button>
        <button
          className="m-2 rounded-sm bg-blue-300 px-2 py-1"
          onClick={closeSocket}
        >
          Close Socket
        </button>
        <button
          className="m-2 rounded-sm bg-purple-300 px-2 py-1"
          onClick={() => setShowCritique(!showCritique)}
        >
          Show Critique
        </button>
      </div>
      <div className="mx-2 flex gap-4">
        <div className="relative flex h-screen w-2/3 flex-col items-center gap-4 text-sm">
          {messages
            .filter((msg) => msg.timelineOwner === "god")
            .map((msg, idx) => (
              <div
                key={idx}
                className={`mx-4 flex w-full whitespace-pre-wrap rounded-md ${msg.role === "interviewer" ? "bg-green-100" : "bg-red-100"} p-4 shadow-md`}
              >
                {msg.content}
              </div>
            ))
            .reverse()}
        </div>
        {showCritique && (
          <div
            hidden={!showCritique}
            className="relative flex h-screen w-1/3 flex-col items-center gap-4 bg-purple-200 text-sm"
          >
            <p className="mt-2 text-lg">Critique</p>
            {showCritique &&
              messages
                .filter((msg) => msg.timelineOwner === "interviewer")
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mx-4 flex w-full whitespace-pre-wrap bg-purple-100 p-4`}
                  >
                    {msg.content}
                  </div>
                ))
                .reverse()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentWebSocket;
