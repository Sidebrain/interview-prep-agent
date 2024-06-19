import { SelecteElement } from "./SelectElement";

const Header = () => {
  return (
    <div className="bg-slate-100 p-2 flex justify-between sticky top-0">
      <SelecteElement
        role="interviewer"
        label="AI Model"
        values={["gpt-4", "gpt-4o", "gpt-3.5"]}
      />
      <SelecteElement
        role="interviewee"
        label="AI Model"
        values={["gpt-4", "gpt-4o", "gpt-3.5", "human"]}
      />
      <SelecteElement
        role="rater"
        label="AI Model"
        values={["gpt-4", "gpt-4o", "gpt-3.5"]}
      />
    </div>
  );
};

export default Header;
