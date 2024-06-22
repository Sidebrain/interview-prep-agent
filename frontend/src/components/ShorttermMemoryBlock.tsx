import { MessageBoxWithoutRole } from "./MessageBox";
import useMemory from "@/hooks/useMemory";

export const ShorttermMemoryBlock = () => {
  const { useShortTermMemoryQuery } = useMemory();
  const { data } = useShortTermMemoryQuery();
  return (
    <div className="flex flex-col gap-1 grow p-2 bg-green-100">
      <p className="text-sm bg-green-300 self-start px-2 rounded-sm py-1">
        Interviewee's Area
      </p>
      {data?.memory_chunks.map((chunk) => (
        <MessageBoxWithoutRole {...chunk} />
      ))}
    </div>
  );
};
