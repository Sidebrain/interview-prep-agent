import { FormEvent, useRef } from "react";
import { Button } from "./ui/button";
import { FiArrowUpCircle, FiPaperclip } from "react-icons/fi";
import ReactTextareaAutosize from "react-textarea-autosize";
import useMemory from "@/hooks/useMemory";

import { v4 as uuidv4 } from "uuid";

const generateUUID = () => {
  return uuidv4();
};

// Usage:
// const uuid = generateUUID();

const InputBox = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { useShortTermMemoryMutation } = useMemory();
  const { mutate } = useShortTermMemoryMutation();

  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      // handle the submit event
      if (!formRef.current) return;
      await handleSubmit(formRef.current);
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | HTMLFormElement
  ) => {
    if (e instanceof Event) e.preventDefault();
    if (!textAreaRef.current) return;
    if (!textAreaRef.current.value) return;
    mutate({
      role: "user",
      content: textAreaRef.current.value,
    });
    textAreaRef.current.value = "";
    // handle the submit event
  };
  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex w-full items-end gap-1 rounded-[8px] border border-gray-300 bg-white p-1 "
      >
        <Button className="px-2 ">
          <FiPaperclip size={24} />
        </Button>
        <ReactTextareaAutosize
          className="flex grow resize-none self-center focus:outline-none"
          placeholder="Type here ..."
          onChange={() => {
            console.log("change");
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
