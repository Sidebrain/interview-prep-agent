import axiosClient from "@/services/axiosClient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type AgentFeatureTextAreaProps = {
  feature: "purpose" | "personality" | "mood";
};

const AgentFeatureTextArea = ({ feature }: AgentFeatureTextAreaProps) => {
  const { data, isLoading } = useSuspenseQuery({
    queryKey: [feature],
    queryFn: async () => {
      const response = await axiosClient.get(`agent/${feature}`);
      console.log(feature, response.data);
      return response.data;
    },
  });
  return (
    <Suspense fallback="Loading...">
      <div className="flex flex-col gap-2 mb-4 text-start p-2 ">
        <Label>{feature}</Label>
        <textarea className="flex border border-slate-400 p-2 ">
          {data[feature]}
        </textarea>
      </div>
    </Suspense>
  );
};

export default AgentFeatureTextArea;
