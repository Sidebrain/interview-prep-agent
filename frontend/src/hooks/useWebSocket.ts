import { WebSocketActionMessages } from "@/types/socketTypes";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

const PossibleAgentRoles = z.enum(["interviewer", "candidate", "god"]);

const WebSocketMessageSchema = z.object({
  timelineOwner: PossibleAgentRoles,
  role: PossibleAgentRoles,
  content: z.string(),
});

type WebSocketMessageType = z.infer<typeof WebSocketMessageSchema>;

const parseSocketMessage = (
  messageJsonString: string,
): WebSocketMessageType | null => {
  // The message is a JSON string received from the client websocket
  // connection. We need to parse it and validate it against the schema
  // based on the schema actions will be taken. Best attempt to parse is made here
  try {
    const parsedString = JSON.parse(messageJsonString);
    return WebSocketMessageSchema.parse(parsedString);
  } catch (error) {
    console.error(messageJsonString);
    console.error("Error parsing message: ", error);
    return null;
  }
};

const useWebSocket = (url: string) => {
  const [userId] = useState<string>(uuidv4());
  const websocketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketMessageType[]>([]);
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
    // send userId to the server
    websocketRef.current = ws;

    websocketRef.current.onopen = () => {
      setIsConnected(true);
      sendUserId(userId);
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    websocketRef.current.onmessage = (ev) => {
      console.log("Message received from server: ", ev.data);
      const parsedMessage = parseSocketMessage(ev.data);
      if (!parsedMessage) {
        return;
      }
      setMessages((prev) => [...prev, parsedMessage]);
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

  const sendUserId = useCallback((userId: UUID) => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      websocketRef.current.send(userId);
    }
  }, []);

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
    userId,
  };
};

export default useWebSocket;
