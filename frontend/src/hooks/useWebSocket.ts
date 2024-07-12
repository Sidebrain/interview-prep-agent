import { WebSocketActionMessages } from "@/types/socketTypes";
import { useCallback, useEffect, useRef } from "react";

const useWebSocket = (url: string) => {
  const websocketRef = useRef<WebSocket | null>(null);

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

    websocketRef.current.onmessage = () => {
      console.log("message received.");
    };

    websocketRef.current.onclose = () => {
      console.log("Websocket closed");
    };
  }, [url]);

  const sendMessage = useCallback(
    (message?: WebSocketActionMessages) => {
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        console.log(message)
        websocketRef.current.send(message ? message : "ping");
      }
    },
    [],
  );

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
  };
};

export default useWebSocket;
