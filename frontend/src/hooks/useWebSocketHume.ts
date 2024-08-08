import {
  Emotion,
  HumeFaceEmotionRootObjectSchema,
} from "@/types/HumeSocketMessageTypes";
import { useCallback, useEffect, useRef, useState } from "react";

type WebSocketHumeHookProps = {
  windowSizeMs: number;
};

const useWebSocketHume = (props: WebSocketHumeHookProps) => {
  const websocketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Emotion[]>([]);
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
    const ws = new WebSocket(
      `${import.meta.env.VITE_HUME_WEBSOCKET_URL}?apiKey=${import.meta.env.VITE_HUME_API_KEY}`,
    );
    // send userId to the server
    websocketRef.current = ws;

    websocketRef.current.onopen = () => {
      //
      console.log("Connected to websocket");
    };

    websocketRef.current.onmessage = (ev) => {
      //
      const data = JSON.parse(ev.data);
      console.log("data", data);
      const validatedData = HumeFaceEmotionRootObjectSchema.parse(data);
      console.log("validatedData", validatedData);
      const mostConfidentEmotions =
        validatedData.face.predictions[0].emotions.sort((a, b) =>
          a.score > b.score ? -1 : +1,
        );
      setMessages([...mostConfidentEmotions]);
      console.log("most confident predictions", mostConfidentEmotions);
    };

    websocketRef.current.onclose = () => {
      setIsConnected(false);
      websocketRef.current = null;
    };
  }, []);

  const reconnect = useCallback(() => {
    //
  }, []);

  const blobToBase64 = useCallback((blob: Blob) => {
    return new Promise((resolve: (value: string) => void, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const result = reader.result as string;

          // console.log("base64String presplit", result);
          const base64String = result.split(",")[1];

          // console.log("base64String", base64String);
          resolve(base64String);
        } else {
          reject("No result from reader");
        }
      };
      reader.onerror = (error) => reject(`File error ${error}`);
      reader.readAsDataURL(blob);
    });
  }, []);

  const sendMessage = useCallback(async (ev: Blob) => {
    // you would send the message from this function
    // console.log("sending message", ev);
    if (!websocketRef.current) {
      console.error("No websocket connection available.");
      return;
    }

    // console.log(ev);

    if (websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(
        JSON.stringify({
          data: await blobToBase64(ev),
          models: {
            ["face"]: {},
          },
          stream_window_ms: props.windowSizeMs,
        }),
      );
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
    //
    reconnect,
    sendMessage,
    closeSocket,
    messages,
    isConnected,
  };
};

export default useWebSocketHume;
