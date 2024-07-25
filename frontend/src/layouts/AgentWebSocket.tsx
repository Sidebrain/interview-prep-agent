import AgentConfig from "@/components/AgentConfig";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useWebSocket from "@/hooks/useWebSocket";
import axiosClient from "@/services/axiosClient";
import { WebSocketActionMessages } from "@/types/socketTypes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type AgentConfigType = {
  //
  god: { system_prompt: string };
  candidate: { system_prompt: string };
  interviewer: { system_prompt: string; critique_prompt: string };
};

const AgentConfigComponent = (props: { userId: string }) => {
  const [availableConfigs, setAvailableConfigs] = useState<string[]>([]);
  const { data, isSuccess } = useQuery({
    queryKey: ["agentConfig"],
    queryFn: async () => {
      const respopnse = await axiosClient.get<AgentConfigType>(
        "/v3/agent-config",
        {
          params: {
            user_id: props.userId,
          },
        },
      );
      const configs = await axiosClient.get<string[]>("/v3/available-config");
      setAvailableConfigs(configs.data);
      return respopnse.data;
    },
  });

  // const { data: s } = useMutation({
  //   mutationKey: ["updateAgentConfig"],
  //   mutationFn: async (config: string) => {
  //     await axiosClient.post("/v3/config", {

  //     });
  //   },
  // });

  const ConfigSelectComponent = () => {
    return (
      <Select>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="agent-config" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Option1" />
          {availableConfigs.map((config) => (
            <SelectItem key={config} value={config}>
              {config}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    isSuccess && (
      <div className="items-top justify-top absolute top-16 z-10 flex h-4/5 w-2/3 flex-col overflow-scroll border-4 border-slate-900 bg-white p-4">
        <div className="flex justify-between gap-16">
          <ConfigSelectComponent />
          <Button
            onClick={() => {
              console.log("clicked");
            }}
            className="border-4 border-green-400"
          >
            Select Config and update agent
          </Button>
        </div>
        <AgentConfig {...data} />
      </div>
    )
  );
};

const AgentWebSocket = () => {
  const { userId, sendMessage, closeSocket, messages, isConnected } =
    useWebSocket(import.meta.env.VITE_WEBSOCKET_URL);
  const [showCritique, setShowCritique] = useState(false);
  const [showAgentConfig, setShowAgentConfig] = useState(false);
  console.log("userId", userId);

  const ButtonTray = () => (
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

  const Messages = () => (
    <div className="relative flex h-screen w-2/3 flex-col items-center gap-4 text-sm">
      {messages
        .filter((msg) => msg.timelineOwner === "god")
        .map((msg, idx) => (
          <div
            key={idx}
            className={`mx-4 flex w-full whitespace-pre-wrap rounded-md ${msg.role === "interviewer" ? "bg-slate-100" : "bg-slate-500 text-slate-100"} p-4 shadow-md`}
          >
            {msg.content}
          </div>
        ))
        .reverse()}
    </div>
  );

  const Critque = () =>
    showCritique && (
      <div
        hidden={!showCritique}
        className="relative flex h-screen w-1/3 flex-col items-center gap-4 bg-slate-700 text-sm text-white"
      >
        <p className="mt-2 text-lg">Critique</p>
        {showCritique &&
          messages
            .filter((msg) => msg.timelineOwner === "interviewer")
            .map((msg, idx) => (
              <div
                key={idx}
                className={`mx-4 flex w-full whitespace-pre-wrap bg-slate-800 p-4 text-white`}
              >
                {msg.content}
              </div>
            ))
            .reverse()}
      </div>
    );

  return (
    <div className="relative flex h-screen flex-col items-center gap-4 text-sm">
      <ButtonTray />
      {showAgentConfig && <AgentConfigComponent userId={userId} />}
      <div className="mx-2 flex gap-4">
        <Messages />
        <Critque />
      </div>
    </div>
  );
};

export default AgentWebSocket;
