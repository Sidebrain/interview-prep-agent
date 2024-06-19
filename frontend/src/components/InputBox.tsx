import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { FiArrowUpCircle, FiPaperclip } from "react-icons/fi";
import ReactTextareaAutosize from "react-textarea-autosize";

const InputBox = () => {
  // if command + enter is pressed, add the message to the message list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      // handle the submit event
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement> | HTMLFormElement) => {
    e.preventDefault();
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
        />

        <Button type="submit" className="px-2">
          <FiArrowUpCircle size={24} />
        </Button>
      </form>
    </>
  );
};

export default InputBox;
