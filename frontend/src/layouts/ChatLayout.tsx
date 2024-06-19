import ChatContainer from "@/components/ChatContainer";
import Header from "@/components/Header";
import InputTray from "@/components/MessageInputBox";

const ChatLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen grow relative overflow-scroll">
      <Header />
      <ChatContainer />
      <InputTray />
    </div>
  );
};

export default ChatLayout;
