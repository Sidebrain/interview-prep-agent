import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AgentWebSocket from "./layouts/AgentWebSocket.tsx";
import VoiceLayout from "./layouts/VoiceLayout.tsx";
import EmotionLayout from "./layouts/EmotionLayout.tsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/agent-websocket",
    element: <AgentWebSocket />,
  },
  {
    path: "/voice",
    element: <VoiceLayout />,
  },
  {
    path: "/emotion",
    element: <EmotionLayout />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
