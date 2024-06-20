import { MessageBoxWithoutRole } from "./MessageBox";
import useMemory from "@/hooks/useMemory";

export const ShorttermMemoryBlock = () => {
  const { useShortTermMemoryQuery } = useMemory();
  const { data } = useShortTermMemoryQuery();
  return (
    <div className="flex flex-col gap-1 grow p-2 bg-green-200">
      <p className="text-sm"> -- User</p>
      {data?.memory_chunks.map((chunk) => (
        <MessageBoxWithoutRole {...chunk} />
      ))}
    </div>
  );
};
