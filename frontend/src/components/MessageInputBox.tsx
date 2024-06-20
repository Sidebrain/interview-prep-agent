import { useMutation, useQueryClient } from "@tanstack/react-query";
import InputBox from "./InputBox";
import { Button } from "./ui/button";
import axiosClient from "@/services/axiosClient";

const InputTray = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["agent/response"],
    mutationFn: async () => {
      const response = await axiosClient.post(`agent/actions/ask-ai`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memory"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
  return (
    <>
      <div className="mb-2 flex flex-col gap-2 sticky bottom-0 center p-2">
        <div className="flex grow w-full justify-center">
          <Button className="" onClick={() => mutate()}>
            Submit
          </Button>
        </div>
        <InputBox />
      </div>
    </>
  );
};

export default InputTray;
