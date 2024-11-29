"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldValues } from "react-hook-form";
import { DatePickerFormProps } from "./FormCustom";

export function DateInput<T extends FieldValues>({
  control,
  name,
  label,
  isTasksDialog,
  ...props
}: DatePickerFormProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col ">
          {!isTasksDialog && (
            <FormLabel className="font-semibold">{label}</FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full max-w-[240px] pl-3 text-left ",
                    !isTasksDialog &&
                      !field.value &&
                      "text-muted-foreground font-normal",
                    isTasksDialog &&
                      "w-full text-wrap flex justify-start h-auto"
                  )}
                >
                  {isTasksDialog && (
                    <>
                      <CalendarIcon />
                      {label}
                    </>
                  )}
                  {!isTasksDialog && field.value && (
                    <>
                      {format(field.value, "PPP")}{" "}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </>
                  )}
                  {!isTasksDialog && !field.value && (
                    <>
                      <span>Pick a date</span>
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                // disabled={(date: Date) =>
                // }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
