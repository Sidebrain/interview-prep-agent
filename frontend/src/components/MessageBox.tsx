type MessageBoxProps = {
  message: string;
  sender: "human" | "agent";
};

const MessageBox = (props: MessageBoxProps) => {
  return (
    <div className="flex flex-col text-left gap-2 bg-green-300 p-2">
      <div className="flex bg-slate-200">{props.sender}</div>
      <div className="flex">{props.message}</div>
    </div>
  );
};

export default MessageBox;
