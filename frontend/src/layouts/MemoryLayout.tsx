import AgentMemoryComponent from "@/components/AgentMemoryComponent";
import { Button } from "@/components/ui/button";
import useAgentActions from "@/hooks/useAgentActions";
import useMemory from "@/hooks/useMemory";

const MemoryLayout = () => {
  const { useTaskMemoryQuery } = useMemory();
  const { useAgentMemoryRefresh, useAgentActionMutation } = useAgentActions();
  const { mutate } = useAgentMemoryRefresh();
  const { data, isLoading } = useTaskMemoryQuery();
  const { mutate: takeAction } = useAgentActionMutation();

  return (
    <div className="flex flex-col gap-4 w-1/3 z-10 p-2 overflow-y-auto h-screen">
      <Button className="w-full bg-red-800" onClick={() => takeAction()}>
        Start Interview
      </Button>
      <Button
        className="w-full bg-slate-300 text-black"
        onClick={() => mutate()}
      >
        Refresh Agent
      </Button>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data?.map((memoryStore) => <AgentMemoryComponent {...memoryStore} />)
      )}
    </div>
  );
};

export default MemoryLayout;
