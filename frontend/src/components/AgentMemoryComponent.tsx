import axiosClient from "@/services/axiosClient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Label } from "./ui/label";

type AgentMemoryProps = {
  type: "dynamic" | "contextual";
};

const AgentMemoryComponent = ({ type }: AgentMemoryProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ["memory", ...type],
    queryFn: async () => {
      const response = await axiosClient.get(`agent/memory/${type}`);
      console.log(type, response.data);
      return response.data;
    },
  });

  return (
    <Suspense fallback="Loading...">
      <div className="flex flex-col gap-2 mb-4 text-start p-2 ">
        <Label>{type}</Label>
        <textarea
          className="flex border border-slate-400 p-2 "
          value={JSON.stringify({ ...data }, null, 4)}
        />
      </div>
    </Suspense>
  );
};

export default AgentMemoryComponent;
