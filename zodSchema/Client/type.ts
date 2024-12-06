import { Control, FieldValues, Path } from "react-hook-form";

export interface SelectableWithCreationProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: any[]; // Array of options
  placeholder?: string; // Optional placeholder
  isAddingNew: boolean;
  addToDatabase: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newData: string;
  toggleValue: () => void;
  isLoading: boolean;
  inputPlaceholder: string;
  addButtonLabel?: string;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  isPopover: boolean;
}
export type QuickFormProps = {
  isAddingNew: boolean;
  addToDatabase: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newData: string;
  toggleValue: () => void;
  inputPlaceholder: string;
  isLoading: boolean;
  addButtonLabel?: string;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  isPopover: boolean;
};
