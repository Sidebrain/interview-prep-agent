import { Suspense } from "react";
import { Label } from "./ui/label";
import { MemoryStoreType } from "@/hooks/useMemory";

const AgentMemoryComponent = ({
  name: label,
  memory_chunks,
  id,
}: MemoryStoreType) => {
  const contentList = memory_chunks.map((chunk) => chunk.content);
  return (
    <Suspense fallback="Loading...">
      <div className="flex flex-col gap-2 mb-4 text-start p-2 w-full" id={id}>
        <Label>{label}</Label>
        <div className="flex border-slate-400 border p-2 text-sm min-h-20 whitespace-pre-line">
          {/* {memory_chunks && memory_chunks.join("\n")} */}
          {contentList.join("\n")}
        </div>
        {/* <textarea
          className="flex border border-slate-400 p-2 "
          value={memoryChunks && memoryChunks.join("\n")}
        /> */}
      </div>
    </Suspense>
  );
};

export default AgentMemoryComponent;
