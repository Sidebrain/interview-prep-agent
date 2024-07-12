import { WebSocketActionMessages } from "@/types/socketTypes";
import { useCallback, useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
  const websocketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const connect = useCallback(() => {
    /*
    Set up a websocket connection and pass it into the ref.
    */
    if (websocketRef.current) {
      return;
    }
    const ws = new WebSocket(url);
    websocketRef.current = ws;

    websocketRef.current.onopen = () => {
      console.log("On open triggered");
    };

    websocketRef.current.onmessage = (ev) => {
      console.log("message received:", ev.data);
      setMessages((prev) => [...prev, ev.data]);
    };

    websocketRef.current.onclose = () => {
      console.log("Websocket closed");
    };
  }, [url]);

  const sendMessage = useCallback((message?: WebSocketActionMessages) => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      websocketRef.current.send(message ? message : "ping");
    }
  }, []);

  const closeSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close(1000, "Client closing connection");
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
      } else {
        console.log("No websocket connection to close.");
      }
      console.log("useEffect cleanup done.");
    };
  }, [connect]);

  return {
    sendMessage,
    closeSocket,
    messages,
  };
};

export default useWebSocket;
