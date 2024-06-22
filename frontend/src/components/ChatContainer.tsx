import { ShorttermMemoryBlock } from "./ShorttermMemoryBlock";
import { LongtermMemoryBlock } from "./LongtermMemoryBlock";

const ChatContainer = () => {
  return (
    <div className="flex flex-col gap-4 grow p-2 text-sm">
      <LongtermMemoryBlock />
      <ShorttermMemoryBlock />
    </div>
  );
};

export default ChatContainer;
