import AgentMemoryComponent from "@/components/AgentMemoryComponent";
import { Button } from "@/components/ui/button";
import axiosClient from "@/services/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ShortTermMemoryLayout = () => {
  const queryClient = useQueryClient();

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
      <AgentMemoryComponent type="dynamic" />
      <AgentMemoryComponent type="contextual" />
    </div>
  );
};

export default ShortTermMemoryLayout;
