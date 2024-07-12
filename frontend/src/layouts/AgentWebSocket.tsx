import useWebSocket from "@/hooks/useWebSocket";
import { WebSocketActionMessages } from "@/types/socketTypes";

const AgentWebSocket = () => {
  const { sendMessage, closeSocket, messages, isConnected } = useWebSocket(
    "ws://localhost:8000/v3/ws",
  );
  return (
    <div className="flex h-screen flex-col items-center gap-2">
      <div className="relative flex w-screen justify-center overflow-hidden">
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
      {messages.map((msg, idx) => (
        <li key={idx}>{msg}</li>
      ))}
    </div>
  );
};

export default AgentWebSocket;
