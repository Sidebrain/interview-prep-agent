import { WebSocketActionMessages } from "@/types/socketTypes";
import { useCallback, useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
  const websocketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    /*
    Set up a websocket connection and pass it into the ref.
    */
    if (websocketRef.current) {
      console.log(websocketRef.current);
      return;
    }
    const ws = new WebSocket(url);
    websocketRef.current = ws;

    websocketRef.current.onopen = () => {
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    websocketRef.current.onmessage = (ev) => {
      console.log("Message received from backend: ", ev.data);
      setMessages((prev) => [...prev, ev.data]);
    };

    websocketRef.current.onclose = () => {
      setIsConnected(false);
      websocketRef.current = null;
    };
  }, [url]);

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      return;
    }
    reconnectTimeoutRef.current = window.setTimeout(() => {
      console.log("Attempting to reconnect...");
      connect();
    }, 5000);
  }, [connect]);

  const sendMessage = useCallback((message?: WebSocketActionMessages) => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      switch (message) {
        case WebSocketActionMessages.RESET:
          console.log("Resetting the agent.");
          setMessages([]);
          websocketRef.current.send("reset");
          break;
        case WebSocketActionMessages.NEXT:
          websocketRef.current.send("next");
          break;
        default:
          websocketRef.current.send("ping");
      }
    }
  }, []);

  const closeSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close(1000, "Client closed the connection");
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        websocketRef.current.close(1000, "component unmounting");
        if (reconnectTimeoutRef.current) {
          window.clearTimeout(reconnectTimeoutRef.current);
        }
      } else {
        console.log("No websocket connection to close.");
      }
    };
  }, [connect]);

  return {
    sendMessage,
    closeSocket,
    messages,
    isConnected,
    reconnect,
    setMessages,
  };
};

export default useWebSocket;
