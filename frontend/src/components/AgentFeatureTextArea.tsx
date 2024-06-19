import axiosClient from "@/services/axiosClient";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { FormEvent, Suspense, useRef } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

type AgentFeatureTextAreaProps = {
  feature: "purpose" | "personality" | "mood";
};

type PostFeatureProps = {
  text: string;
};

const AgentFeatureTextArea = ({ feature }: AgentFeatureTextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    queryKey: [feature],
    queryFn: async () => {
      const response = await axiosClient.get(`agent/${feature}`);
      console.log(feature, response.data);
      return response.data;
    },
  });

  const { mutate, isSuccess } = useMutation({
    mutationFn: async (input: PostFeatureProps) => {
      const response = await axiosClient.post(`agent/${feature}`, input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [feature] });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (textAreaRef.current) {
      const text = textAreaRef.current.value;
      console.log(text);
      mutate({ text });
    }
  };
  return (
    <Suspense fallback="Loading...">
      <form
        className="flex flex-col gap-2 mb-4 text-start p-2 "
        onSubmit={handleSubmit}
      >
        <Label>{`Current ${feature}`}</Label>
        <textarea
          ref={textAreaRef}
          className="flex border border-slate-400 p-2 "
          defaultValue={data ? data[feature] ?? "Null" : ""}
          onChange={(e) => e.currentTarget.value}
        />
        <Button className="w-full" type="submit">
          Update {feature}
        </Button>
      </form>
    </Suspense>
  );
};

export default AgentFeatureTextArea;
