import AgentMemoryComponent from "@/components/AgentMemoryComponent";
import { Button } from "@/components/ui/button";
import useMemory from "@/hooks/useMemory";
import axiosClient from "@/services/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const MemoryLayout = () => {
  const queryClient = useQueryClient();
  const { useTaskMemoryQuery } = useMemory();
  const { data, isLoading } = useTaskMemoryQuery();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post(`agent/actions/refresh`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["memory"] });
      console.log("Success");
    },
  });

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
