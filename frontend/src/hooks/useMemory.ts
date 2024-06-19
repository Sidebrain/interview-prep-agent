import axiosClient from "@/services/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AgentMemoryProps = {
  value: string;
  field: string;
};

const useMemory = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post(`agent/memory/${type}`);
      return response.data;
    },
  });
};
