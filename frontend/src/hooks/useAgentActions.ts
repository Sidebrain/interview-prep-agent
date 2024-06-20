import axiosClient from "@/services/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAgentActions = () => {
  const queryClient = useQueryClient();
  // Refresh memory
  const useAgentMemoryRefresh = () =>
    useMutation({
      mutationFn: async () => {
        const response = await axiosClient.post(`v2/agent/actions/refresh`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
        queryClient.invalidateQueries({ queryKey: ["memory"] });
        console.log("Success");
      },
    });

  const useAgentActionMutation = () =>
    useMutation({
      mutationFn: async () => {
        const response = await axiosClient.post(`v2/agent/actions/act`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
        queryClient.invalidateQueries({ queryKey: ["memory"] });
      },
    });

  return {
    useAgentMemoryRefresh,
    useAgentActionMutation,
  };
};

export default useAgentActions;
