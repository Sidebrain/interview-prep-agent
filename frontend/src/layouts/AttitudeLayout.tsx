import AgentFeatureTextArea from "@/components/AgentFeatureTextArea";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Suspense } from "react";

const AttitudeLayout = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button className="w-full">Attitude</Button>
        </SheetTrigger>
        <SheetContent className="flex min-w-1/3">
          <SheetHeader className="items-start">
            <SheetTitle>The Attitude of the Agent</SheetTitle>
            <SheetDescription className="text-left ">
              These are the fields that are responsible for setting the agent's
              attitude.
            </SheetDescription>
            <div className="flex flex-col gap-4 w-full">
              <Suspense fallback="Loading...">
                <AgentFeatureTextArea feature="purpose" />
                <AgentFeatureTextArea feature="personality" />
                <AgentFeatureTextArea feature="mood" />
              </Suspense>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AttitudeLayout;
