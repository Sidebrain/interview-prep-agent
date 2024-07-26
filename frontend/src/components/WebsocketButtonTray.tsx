import { WebSocketActionMessages } from "@/types/socketTypes";

type WebsocketButtonTrayProps = {
  sendMessage: (message?: WebSocketActionMessages) => void;
  closeSocket: () => void;
  setShowCritique: (show: boolean) => void;
  showCritique: boolean;
  showAgentConfig: boolean;
  setShowAgentConfig: (show: boolean) => void;
  isConnected: boolean;
};

const WebsocketButtonTray = ({
  sendMessage,
  closeSocket,
  setShowCritique,
  setShowAgentConfig,
  showAgentConfig,
  showCritique,
  isConnected,
}: WebsocketButtonTrayProps) => (
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

export default WebsocketButtonTray;
