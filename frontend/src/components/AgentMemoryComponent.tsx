import { Suspense } from "react";
import { Label } from "./ui/label";
import { MemoryStoreType } from "@/hooks/useMemory";

const AgentMemoryComponent = ({
  name: label,
  memoryChunks,
  id,
}: MemoryStoreType) => {
  return (
    <Suspense fallback="Loading...">
      <div className="flex flex-col gap-2 mb-4 text-start p-2 " id={id}>
        <Label>{label}</Label>
        <textarea
          className="flex border border-slate-400 p-2 "
          value={memoryChunks && memoryChunks.join("\n")}
        />
      </div>
    </Suspense>
  );
};

export default AgentMemoryComponent;
