import AttitudeLayout from "./AttitudeLayout";
import ChatLayout from "./ChatLayout";
import MemoryLayout from "./MemoryLayout";

const AgentLayout = () => {
  return (
    <div className="flex w-screen items-center relative overflow-hidden ">
      <MemoryLayout />
      <ChatLayout />
      <AttitudeLayout />
    </div>
  );
};

export default AgentLayout;
