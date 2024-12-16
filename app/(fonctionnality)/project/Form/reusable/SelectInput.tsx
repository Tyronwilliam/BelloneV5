"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldValues } from "react-hook-form";
import { SelectFormProps } from "./FormCustom";
import { cn } from "@/lib/utils";
import MultiSelect from "./MultiSelect";
// defaultValue={field.value}
export function SelectInput<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
}: SelectFormProps<T>) {
  const mock = () => {
    return;
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="font-semibold">{label}</FormLabel>
            <Select onValueChange={field.onChange} {...field}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={placeholder || "Select an option"}
                  />
                </SelectTrigger>
              </FormControl>
              {Array.isArray(field?.value) ? (
                <MultiSelect
                  options={options}
                  value={field?.value}
                  onChange={mock}
                  placeholder={placeholder}
                />
              ) : (
                <SelectContent defaultValue={field?.value} key={field?.value}>
                  {options.map((option, index) => {
                    return (
                      <SelectItem
                        key={index}
                        value={option.value}
                        className={cn(
                          option?.color && option?.color,
                          "mb-2 font-bold"
                        )}
                      >
                        {option.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              )}
            </Select>
            {/* Uncomment if you want to include form description and messages
          <FormDescription>
            You can manage email addresses in your{" "}
            <Link href="/examples/forms">email settings</Link>.
          </FormDescription>
          */}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
