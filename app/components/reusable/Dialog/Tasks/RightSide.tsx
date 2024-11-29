import { Button } from "@/components/ui/button";
import { Hourglass, Timer, User } from "lucide-react";
import { BiDuplicate } from "react-icons/bi";
import { Form } from "@/components/ui/form";

import React from "react";
import DateItem from "./RightSIdeItem/Date";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ItemInterface, ItemInterfaceType } from "@/zodSchema/Project/tasks";
import { toast } from "@/hooks/use-toast";

const RightSide = () => {
  const form = useForm<z.infer<typeof ItemInterface>>({
    resolver: zodResolver(ItemInterface),
    defaultValues: {},
  });
  function onSubmit(data: ItemInterfaceType) {
    toast({
      title: "You submitted the following values:",
      description: "Sucess",
    });
  }
  return (
    <section className="w-1/4 h-full  p-2">
      <section className="w-full flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <DateItem
              control={form.control}
              name="start_date"
              label="Date dialog"
              isTasksDialog={true}
            />
            <Button
              variant="outline"
              className="w-full text-wrap flex justify-start h-auto"
            >
              <User /> Members
              {/* assigner à un user ou soi meme */}
            </Button>
            <Button
              variant="outline"
              className="w-full text-wrap flex justify-start "
            >
              <Hourglass /> Complete At
            </Button>
            <Button
              variant="outline"
              className="w-full text-wrap flex justify-start "
            >
              <Timer /> Timer
            </Button>
            <Button
              variant="outline"
              className="w-full text-wrap flex justify-start "
            >
              <BiDuplicate /> Dupliquer
            </Button>
          </form>
        </Form>
      </section>
    </section>
  );
};

export default RightSide;
