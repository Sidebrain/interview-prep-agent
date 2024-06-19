import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectElementProps = {
  role: "interviewer" | "interviewee" | "rater";
  label: string;
  values: string[];
};

export function SelecteElement(props: SelectElementProps) {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={`Select an AI Model for ${props.role}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{props.label}</SelectLabel>
          {props.values.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
