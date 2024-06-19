import { FormEvent, useRef } from "react";
import { Button } from "./ui/button";
import { FiArrowUpCircle, FiPaperclip } from "react-icons/fi";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MemoryInput } from "@/types";
import axiosClient from "@/services/axiosClient";

const InputBox = () => {
  const queryClient = useQueryClient();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate } = useMutation({
    mutationFn: async (mem: MemoryInput) => {
      const response = await axiosClient.post(`agent/memory/augment`, mem);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
  });
  // if command + enter is pressed, add the message to the message list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      // handle the submit event
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | HTMLFormElement
  ) => {
    e.preventDefault();
    if (!textAreaRef.current) return;
    if (!textAreaRef.current.value) return;
    await mutate({
      memtype: "dynamic",
      field: "short",
      value: textAreaRef.current.value,
    });
    textAreaRef.current.value = "Look ma I am cleared";
    // handle the submit event
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-end gap-1 rounded-[8px] border border-gray-300 bg-white p-1 "
      >
        <Button className="px-2 ">
          <FiPaperclip size={24} />
        </Button>
        <ReactTextareaAutosize
          className="flex grow resize-none self-center focus:outline-none"
          placeholder="Type here ..."
          onChange={(e) => {
            console.log(e.currentTarget.value);
          }}
          onKeyDown={handleKeyDown}
          ref={textAreaRef}
        />

        <Button type="submit" className="px-2">
          <FiArrowUpCircle size={24} />
        </Button>
      </form>
    </>
  );
};

export default InputBox;
