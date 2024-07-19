import { AgentConfigType } from "@/layouts/AgentWebSocket";

type ConfigType = {
  system_prompt: string;
  critique_prompt?: string;
};

const IndividualConfig = (props: ConfigType) => {
  return (
    <div className="flex flex-col gap-4 p-2">
      {Object.entries(props).map(([key, value]) => {
        return (
          <div key={key} className="flex flex-col gap-2">
            <p className="font-bold">{key}</p>
            <div className="flex border border-slate-500 p-2">{value}</div>
          </div>
        );
      })}
    </div>
  );
};

const AgentConfig = (props: AgentConfigType) => {
  return (
    <div className="flex flex-col gap-4 p-2">
      {Object.entries(props).map(([key, value]) => {
        return (
          <div className="">
            <p className="bg-red-300 px-2 py-1 font-bold">{key}</p>
            <IndividualConfig key={key} {...value} />
          </div>
        );
      })}
    </div>
  );
};

export default AgentConfig;
