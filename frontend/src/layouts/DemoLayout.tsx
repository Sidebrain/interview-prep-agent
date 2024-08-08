"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DynamicLayout from "./DynamicLayout";
import useDemoWebSocket from "@/hooks/useDemoWebSocket";

const formSchema = z.object({
  role: z.string().min(10),
  company: z.string().min(1),
  team: z.string().min(1),
});

const DemoForm = ({
  sendMessage,
}: {
  sendMessage: (message: string) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("submit clicked");
    console.log("data", data);
    await sendMessage(JSON.stringify(data));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-8 p-6"
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role using natural language"
                  defaultValue={"Senior Product Designer"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Name the company and describe what it does in natural language"
                  defaultValue={"Apple Inc"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the team that you are hiring for and what they do in natural language"
                  defaultValue={"App Store team"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-8 flex grow">
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

const DemoLayout = () => {
  const { sendMessage, messages } = useDemoWebSocket(
    "ws://localhost:8080/v3/demo/ws",
  );
  return (
    <div className="flex h-screen gap-2">
      <DemoForm sendMessage={sendMessage} />
      <div className="flex w-full flex-col bg-gray-200">
        <DynamicLayout messageList={messages.messageList} />
      </div>
    </div>
  );
};

export default DemoLayout;
