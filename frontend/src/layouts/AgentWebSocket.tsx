import AgentConfig from "@/components/AgentConfig";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { set } from "zod";

export type AgentConfigType = {
  //
  god: { system_prompt: string };
  candidate: { system_prompt: string };
  interviewer: { system_prompt: string; critique_prompt: string };
};

type AgentConfigComponentProps = {
  userId: string;
  sendMessage: (message?: WebSocketActionMessages) => void;
  setShowAgentConfig: (show: boolean) => void;
};

const AgentConfigComponent = (props: AgentConfigComponentProps) => {
  const [availableConfigs, setAvailableConfigs] = useState<string[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: agentConfigObject, isSuccess: isAgentConfigObjectSuccess } =
    useQuery({
      queryKey: ["getAgentConfigText"],
      queryFn: async () => {
        const { data } = await axiosClient.get<AgentConfigType>(
          "/v3/agent-config-text",
          {
            params: {
              user_id: props.userId,
              selected: selectedConfig,
            },
          },
        );
        return data;
      },
    });

  type ChangeAgentConfigMutationType = {
    config: string;
    selected: boolean;
  };

  const { mutate } = useMutation({
    mutationKey: ["changeAgentConfig"],
    mutationFn: async ({ config, selected }: ChangeAgentConfigMutationType) => {
      console.log("mutationFn", config);
      console.log(
        "mutationFn select state, this should be true --> ",
        selected,
      );
      const { data } = await axiosClient.post(
        "/v3/agent-config",
        {
          user_id: props.userId,
          new_purpose_file_path: config,
        },
        {
          params: {
            selected: selected,
          },
        },
      );
      console.log("mutation data\n\n", data);
      return data;
    },
    onSuccess: () => {
      console.log("onSuccess");
      queryClient.invalidateQueries({
        queryKey: ["getAgentConfigText"],
      });
    },
  });

  useEffect(() => {
    //
    const fetchAvailableAgentConfigs = async () => {
      const { data } = await axiosClient.get<string[]>("/v3/available-configs");
      setAvailableConfigs(data);
    };
    fetchAvailableAgentConfigs();
    setSelectedConfig(false);
  }, []);

  const ConfigSelectComponent = () => {
    return (
      <Select
        onValueChange={(e) => {
          console.log("onValueChange", e);
          setSelectedConfig(true);
          mutate({ config: e, selected: true });
        }}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="agent_config.yaml" />
        </SelectTrigger>
        <SelectContent>
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
    <div className="items-top justify-top absolute top-16 z-10 flex h-4/5 w-2/3 flex-col overflow-scroll border-4 border-slate-900 bg-white p-4">
      <div className="flex justify-between gap-16">
        <ConfigSelectComponent />
      </div>
      {isAgentConfigObjectSuccess && <AgentConfig {...agentConfigObject} />}
    </div>
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
      {showAgentConfig && (
        <AgentConfigComponent
          userId={userId}
          sendMessage={sendMessage}
          setShowAgentConfig={setShowAgentConfig}
        />
      )}
      <div className="mx-2 flex gap-4">
        <Messages />
        <Critque />
      </div>
    </div>
  );
};

export default AgentWebSocket;
