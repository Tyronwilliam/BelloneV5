import { Control, FieldValues, Path } from "react-hook-form";

export interface FormFieldComponentProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

export interface DatePickerFormProps<T extends FieldValues>
  extends Omit<FormFieldComponentProps<T>, "type" | "placeholder"> {
  isTasksDialog: boolean;
}

export interface SelectFormProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: any[]; // Array of options
  placeholder?: string; // Optional placeholder
}

export interface ControlProps<T extends FieldValues> {
  control: Control<T>;
}
