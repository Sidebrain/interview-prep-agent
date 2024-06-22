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
import useMemory from "@/hooks/useMemory";
import { Suspense } from "react";

const AttitudeLayout = () => {
  const { useIdentityMemoryQuery } = useMemory();
  const { data: identityStore, isSuccess } = useIdentityMemoryQuery();
  console.log(identityStore);
  return (
    <div className="flex h-screen items-start mt-4">
      <Sheet>
        <SheetTrigger>
          <Button className="w-full self-start">See Attitude</Button>
        </SheetTrigger>
        <SheetContent className="flex min-w-1/3">
          <SheetHeader className="items-start">
            <SheetTitle>The Attitude of the Agent</SheetTitle>
            <SheetDescription className="text-left ">
              These are the fields that are responsible for setting the agent's
              attitude.
            </SheetDescription>
            <div className="flex flex-col gap-4 w-full overflow-scroll">
              <Suspense fallback="Loading...">
                {isSuccess &&
                  identityStore?.memory_chunks.map((chunk) => (
                    <AgentFeatureTextArea {...chunk} />
                  ))}
              </Suspense>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AttitudeLayout;
