import { useQuery } from "@tanstack/react-query";
import MessageBox from "./MessageBox";
import axiosClient from "@/services/axiosClient";

type DynamicMemory = {
  long: string[];
  short: string[];
};

const ChatContainer = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await axiosClient.get<DynamicMemory>(
        "agent/memory/dynamic"
      );
      return response.data;
    },
  });
  return (
    <div className="flex flex-col gap-4 grow p-2 bg-red-200">
      {data?.short.map((message) => (
        <MessageBox key={message} message={message} sender={"human"} />
      ))}
    </div>
  );
};

export default ChatContainer;
