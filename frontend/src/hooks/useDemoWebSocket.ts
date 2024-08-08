import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string(),
});

const responseSchema = z.object({
  messageList: z.array(messageSchema),
});

export type ResponseType = z.infer<typeof responseSchema>;

const useWebSocket = (url: string) => {
  const [userId] = useState<string>(uuidv4());
  const websocketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ResponseType>({ messageList: [] });
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const parseSocketMessage = (
    messageJsonString: string,
  ): ResponseType | null => {
    try {
      // try parsing the JSON string here
      const parsedData = JSON.parse(messageJsonString);
      console.log("parsedData", parsedData);
      // return parsedData.messageList.map(
      //   (message: z.infer<typeof messageSchema>) =>
      //     responseSchema.parse(message),
      // );
      const parsedSchema = responseSchema.parse(parsedData);
      console.log("parsedSchema", parsedSchema);
      return parsedSchema;
    } catch (error) {
      console.error("Error parsing message: ", error);
      return null;
    }
  };

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
      setMessages(parsedMessage);
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

  const sendUserId = useCallback((userId: string) => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      websocketRef.current.send(userId);
    }
  }, []);

  const sendMessage = useCallback((message?: string) => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      if (!message) {
        return;
      }
      websocketRef.current.send(message);
      // switch (message) {
      //   case "something involving K, but now is a string":
      //     break;
      //   default:
      //     websocketRef.current.send("ping");
      // }
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
