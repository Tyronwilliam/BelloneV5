import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues } from "react-hook-form";
import { FormFieldComponentProps } from "./FormCustom";
import { DollarSign } from "lucide-react";

const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
  e.currentTarget.blur();
};
function CustomFormItem<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
  className,
}: FormFieldComponentProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <FormControl>
            {type === "number" ? (
              <div className="relative  w-full">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type={type}
                  onWheel={handleWheel}
                  placeholder={placeholder}
                  {...field}
                  className={className}
                />{" "}
              </div>
            ) : (
              <Input type={type} placeholder={placeholder} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomFormItem;
