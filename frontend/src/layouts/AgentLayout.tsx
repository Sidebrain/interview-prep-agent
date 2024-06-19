import AttitudeLayout from "./AttitudeLayout";
import ChatLayout from "./ChatLayout";
import ShortTermMemoryLayout from "./ShortTermMemoryLayout";

const AgentLayout = () => {
  return (
    <div className="flex w-screen items-center relative overflow-hidden ">
      <ShortTermMemoryLayout />
      <ChatLayout />
      <AttitudeLayout />
    </div>
  );
};

export default AgentLayout;
