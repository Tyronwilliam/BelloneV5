import { Control, FieldValues, Path } from "react-hook-form";
import { ClientSchema } from "./zodSchema";

export interface ClientFormPropss<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: any[]; // Array of options
  placeholder?: string; // Optional placeholder
  isAddingNew: boolean;
  addClientToDatabase: () => void;
  handleNewClientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newClientEmail: string;
  toggleValue: () => void;
}
export type ClientFormProps = {
  isAddingNew: boolean;
  addClientToDatabase: () => void;
  handleNewClientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newClientEmail: string;
  toggleValue: () => void;
};
