import AgentConfig from "@/components/AgentConfig";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosClient from "@/services/axiosClient";
import { WebSocketActionMessages } from "@/types/socketTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
  const [selectedConfig, setSelectedConfig] = useState<string>("");
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
              selected: selectedConfig ? true : false,
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
      selected ? null : props.sendMessage(WebSocketActionMessages.RESET);
      return data;
    },
    onSuccess: () => {
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

    const getCurrentAgentConfig = async () => {
      const { data } = await axiosClient.get<{ agent_config_path: string }>(
        "/v3/agent-config",
        {
          params: {
            user_id: props.userId,
          },
        },
      );
      setSelectedConfig(data.agent_config_path);
    };
    fetchAvailableAgentConfigs();
    getCurrentAgentConfig();
  }, []);

  const ConfigSelectComponent = () => {
    return (
      <Select
        onValueChange={(e) => {
          mutate({ config: e, selected: true });
          setSelectedConfig(e);
        }}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder={selectedConfig} />
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
        {selectedConfig && (
          <Button
            className="bg-green-600"
            onClick={() => {
              mutate({ config: selectedConfig, selected: false });
              props.setShowAgentConfig(false);
            }}
          >
            Select this agent configuration
          </Button>
        )}
      </div>
      {isAgentConfigObjectSuccess && <AgentConfig {...agentConfigObject} />}
    </div>
  );
};

export default AgentConfigComponent;
