import AgentMemoryComponent from "@/components/AgentMemoryComponent";

const ShortTermMemoryLayout = () => {
  return (
    <div className="flex flex-col gap-4 w-1/3 items-start z-10 ">
      <AgentMemoryComponent type="dynamic" />
      <AgentMemoryComponent type="contextual" />
    </div>
  );
};

export default ShortTermMemoryLayout;
