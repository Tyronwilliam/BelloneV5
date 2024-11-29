import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

import { DateInput } from "@/app/(fonctionnality)/project/Form/reusable/DateInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePickerFormProps } from "@/app/(fonctionnality)/project/Form/reusable/FormCustom";
import { FieldValues } from "react-hook-form";

function DateItem<T extends FieldValues>({
  control,
  name,
  label,
  isTasksDialog,
}: DatePickerFormProps<T>) {
  return (
    // <Popover>
    //   <PopoverTrigger asChild>
    //     <Button
    //       variant="outline"
    //       className="w-full text-wrap flex justify-start "
    //     >
    //       <Calendar /> Date
    //     </Button>
    //   </PopoverTrigger>
    //   <PopoverContent className="w-auto p-0" align="start">
    <DateInput
      control={control}
      name={name}
      label={label}
      isTasksDialog={isTasksDialog}
    />
    //   </PopoverContent>
    // </Popover>
  );
}

export default DateItem;
