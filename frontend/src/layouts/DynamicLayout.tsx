import { ResponseType } from "@/hooks/useDemoWebSocket";

const DynamicLayout = ({ messageList }: ResponseType) => {
  console.log("messages", messageList);
  console.log(messageList.map((message) => message.content));
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-scroll bg-slate-300 p-4">
      {messageList.map((message, index) => (
        <div
          key={index}
          className="flex whitespace-break-spaces rounded-md border border-black p-4 [contentEditable:true]"
        >
          {message.content}
        </div>
      ))}
    </div>
  );
};

export default DynamicLayout;
