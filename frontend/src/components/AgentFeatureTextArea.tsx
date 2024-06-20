import { FormEvent, Suspense, useRef } from "react";
import { Label } from "./ui/label";
import { MemoryChunkType } from "@/hooks/useMemory";

const AgentFeatureTextArea = ({ id, content, tag }: MemoryChunkType) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // const queryClient = useQueryClient();

  // const { mutate, isSuccess } = useMutation({
  //   mutationFn: async (input: PostFeatureProps) => {
  //     const response = await axiosClient.post(`v2/agent/${feature}`, input);
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [feature] });
  //   },
  // });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (textAreaRef.current) {
      const text = textAreaRef.current.value;
      console.log(text);
      // mutate({ text });
    }
  };
  return (
    <Suspense fallback="Loading...">
      <form
        className="flex flex-col gap-2 mb-4 text-start p-2 "
        onSubmit={handleSubmit}
        id={id}
      >
        <Label>{`Current ${tag}`}</Label>
        <div className="flex border-slate-400 border p-2 text-sm">
          {content}
        </div>
        {/* TODO: Show textarea when you add mutations 
        <textarea
          ref={textAreaRef}
          className="flex border border-slate-400 p-2 text-sm"
          // defaultValue={data ? data[feature] ?? "Null" : ""}
          defaultValue={content}
          onChange={(e) => e.currentTarget.value}
        /> */}
        {/* <Button className="w-full" type="submit">
          Update {tag}
        </Button> */}
      </form>
    </Suspense>
  );
};

export default AgentFeatureTextArea;
