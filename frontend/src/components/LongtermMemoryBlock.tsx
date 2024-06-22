import MessageBox from "./MessageBox";
import useMemory from "@/hooks/useMemory";

export const LongtermMemoryBlock = () => {
  const { useLongTermMemoryQuery } = useMemory();
  const { data } = useLongTermMemoryQuery();
  return (
    <div className="flex flex-col gap-4 grow p-2 border ">
      {data?.memory_chunks.map((chunk) => (
        <MessageBox {...chunk} />
      ))}
    </div>
  );
};
