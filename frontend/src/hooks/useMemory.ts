import axiosClient from "@/services/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MemoryChunkType = {
  id: string; // UUID
  content: string;
  role: string;
  created_at: Date;
  edited_at: Date;
  tag: string;
};

type MemoryStoreType = {
  id: string; // UUID
  name: string;
  memory_chunks: MemoryChunkType[];
  created_at: Date;
  edited_at: Date;
};

type MemoryRepoType = {
  id: string; // UUID
  name: string;
  memory_stores: MemoryStoreType[];
  created_at: Date;
  edited_at: Date;
};

const useMemory = () => {
  const queryClient = useQueryClient();

  const useAllMemoryQuery = () =>
    useQuery({
      queryKey: ["memory"],
      queryFn: async () => {
        const response = await axiosClient.get<MemoryStoreType[]>(
          "v2/agent/memory/all-memory"
        );
        return response.data;
      },
    });

  const useTaskMemoryQuery = () =>
    useQuery({
      queryKey: ["memory", "task"],
      queryFn: async () => {
        const response = await axiosClient.get<MemoryStoreType[]>(
          "v2/agent/memory/task-memory"
        );
        return response.data;
      },
    });

  const useIdentityMemoryQuery = () =>
    useQuery({
      queryKey: ["memory", "identity"],
      queryFn: async () => {
        const response = await axiosClient.get<MemoryStoreType>(
          "v2/agent/memory/identity-memory"
        );
        return response.data;
      },
    });

  const useWorkingMemoryQuery = () =>
    useQuery({
      queryKey: ["memory", "working"],
      queryFn: async () => {
        const response = await axiosClient.get<MemoryStoreType>(
          "v2/agent/memory/working-memory"
        );
        return response.data;
      },
    });

  const useLongTermMemoryQuery = () =>
    useQuery({
      queryKey: ["memory", "long-term"],
      queryFn: async () => {
        const response = await axiosClient.get<MemoryStoreType>(
          "v2/agent/memory/long-term-memory"
        );
        return response.data;
      },
    });

  const useShortTermMemoryQuery = () =>
    useQuery({
      queryKey: ["memory", "short-term"],
      queryFn: async () => {
        const response = await axiosClient.get<MemoryStoreType>(
          "v2/agent/memory/short-term-memory"
        );
        return response.data;
      },
    });

  // const useIdentityMemoryMutationQuery = () =>
  //     useMutation({
  //         mutationFn: async
  //     })

  return {
    useAllMemoryQuery,
    useTaskMemoryQuery,
    useIdentityMemoryQuery,
    useWorkingMemoryQuery,
    useLongTermMemoryQuery,
    useShortTermMemoryQuery,
  };
};

export default useMemory;
export type { MemoryStoreType, MemoryChunkType, MemoryRepoType };
