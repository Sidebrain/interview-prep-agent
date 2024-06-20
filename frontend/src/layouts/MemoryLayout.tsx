import AgentMemoryComponent from "@/components/AgentMemoryComponent";
import { Button } from "@/components/ui/button";
import useAgentActions from "@/hooks/useAgentActions";
import useMemory from "@/hooks/useMemory";

const MemoryLayout = () => {
  const { useTaskMemoryQuery } = useMemory();
  const { useAgentMemoryRefresh } = useAgentActions();
  const { mutate } = useAgentMemoryRefresh();
  const { data, isLoading } = useTaskMemoryQuery();

  return (
    <div className="flex flex-col gap-4 w-1/3 items-start z-10 ">
      <Button className="w-full" onClick={() => mutate()}>
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
