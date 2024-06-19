import InputBox from "./InputBox";

type ChatSectionProps = {
  userId: number;
  activeConvId: number;
};

const InputTray = () => {
  return (
    <>
      <div className="mb-2 flex flex-col gap-2 sticky bottom-0 center p-2">
        <InputBox />
      </div>
    </>
  );
};

export default InputTray;
