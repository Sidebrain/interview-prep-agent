import InputBox from "./InputBox";
import { Button } from "./ui/button";
import useAgentActions from "@/hooks/useAgentActions";

const InputTray = () => {
  const { useAgentActionMutation } = useAgentActions();
  const { mutate } = useAgentActionMutation();

  return (
    <>
      <div className="mb-2 w-full flex flex-col gap-2 sticky bottom-0 center p-2">
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
