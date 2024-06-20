import { MemoryChunkType } from "@/hooks/useMemory";

const MessageBox = (props: MemoryChunkType) => {
  return (
    <div
      id={props.id}
      className="flex flex-col text-left gap-2 bg-green-300 p-2"
    >
      <div className="flex bg-slate-200">{props.role}</div>
      <div className="flex">{props.content}</div>
    </div>
  );
};
const MessageBoxWithoutRole = (props: MemoryChunkType) => {
  return (
    <div
      id={props.id}
      className="flex flex-col text-left gap-2 bg-green-300 p-2"
    >
      <div className="flex">{props.content}</div>
    </div>
  );
};

export default MessageBox;
export { MessageBoxWithoutRole };
