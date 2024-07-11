import useWebSocket from "@/hooks/useWebSocket";

const AgentWebSocket = () => {
  const { sendMessage, closeSocket } = useWebSocket(
    "ws://localhost:8000/v3/ws",
  );
  return (
    <div className="relative flex h-screen w-screen flex-col items-center overflow-hidden">
      {/* <Header />
      <SocketMessagesContainer />
      <InputTray /> */}
      <button onClick={sendMessage}>Send Message</button>
      <button onClick={closeSocket}>Close Socket</button>
    </div>
  );
};

export default AgentWebSocket;
