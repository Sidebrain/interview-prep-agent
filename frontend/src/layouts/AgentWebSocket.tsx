import useWebSocket from "@/hooks/useWebSocket";
import { WebSocketActionMessages } from "@/types/socketTypes";

const AgentWebSocket = () => {
  const { sendMessage, closeSocket, messages, isConnected } = useWebSocket(
    "ws://localhost:8000/v3/ws",
  );
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
      </div>
      {messages
        .map((msg, idx) => (
          <div
            key={idx}
            className={`mx-4 flex w-2/3 whitespace-pre-wrap rounded-md ${idx % 2 === 0 ? "bg-green-100" : "bg-red-100"} p-4 shadow-md`}
          >
            {msg}
          </div>
        ))
        .reverse()}
    </div>
  );
};

export default AgentWebSocket;
