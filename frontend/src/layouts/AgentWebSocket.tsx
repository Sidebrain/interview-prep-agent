import useWebSocket from "@/hooks/useWebSocket";

const AgentWebSocket = () => {
  const { sendMessage, closeSocket, messages } = useWebSocket(
    "ws://localhost:8000/v3/ws",
  );
  return (
    <div className="flex h-screen w-screen flex-col items-center gap-2">
      <div className="relative flex w-screen justify-center overflow-hidden">
        <button
          className="m-2 rounded-sm bg-blue-300 px-2 py-1"
          onClick={() => sendMessage()}
        >
          Send Message
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
