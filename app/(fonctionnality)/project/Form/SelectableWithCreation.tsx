"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QuickFormProps,
  SelectableWithCreationProps,
} from "@/zodSchema/Client/type";
import { ClientSchema } from "@/zodSchema/Client/zodSchema";
import React, { ReactNode } from "react";
import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { SelectInput } from "./reusable/SelectInput";
import SimplePopover from "@/app/components/reusable/Popover/SimplePopover";
import { User } from "lucide-react";

export const QuickForm: React.FC<QuickFormProps> = ({
  isAddingNew,
  addToDatabase,
  newData,
  handleChange,
  toggleValue,
  inputPlaceholder,
  isLoading,
  addButtonLabel = "Add New",
  saveButtonLabel = "Save",
  cancelButtonLabel = "Cancel",
  isPopover,
}) => {
  return (
    <div className="flex space-x-2 mt-2">
      {!isAddingNew ? (
        <Button
          onClick={toggleValue}
          type="button"
          className={`${isPopover && "mx-auto"}`}
        >
          {addButtonLabel}
        </Button>
      ) : (
        <div className="flex flex-col space-y-2 w-full">
          <Input
            value={newData}
            onChange={handleChange}
            placeholder={inputPlaceholder}
            className="w-full"
          />
          <div className="flex gap-2 mt-2 items-center">
            <Button onClick={addToDatabase} type="button" disabled={isLoading}>
              {isLoading ? "Saving..." : `${saveButtonLabel}`}
            </Button>

            <Button onClick={toggleValue} type="button" variant="outline">
              {cancelButtonLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export function SelectableWithCreation<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  addToDatabase,
  isAddingNew,
  handleChange,
  newData,
  toggleValue,
  isLoading,
  inputPlaceholder,
  addButtonLabel,
  saveButtonLabel,
  cancelButtonLabel,
  isPopover,
}: SelectableWithCreationProps<T>) {
  return (
    <>
      {options.length > 0 && (
        <SelectInput
          control={control}
          name={name}
          label={label}
          placeholder={placeholder}
          options={options}
        />
      )}
      {isPopover ? (
        <PopoverView
          icon={<User />}
          label={label}
          classCustom="w-full text-wrap flex justify-start button-custom"
        >
          <QuickForm
            addToDatabase={addToDatabase}
            isAddingNew={isAddingNew}
            newData={newData}
            handleChange={handleChange}
            toggleValue={toggleValue}
            inputPlaceholder={inputPlaceholder}
            addButtonLabel={addButtonLabel}
            saveButtonLabel={saveButtonLabel}
            cancelButtonLabel={cancelButtonLabel}
            isLoading={isLoading}
            isPopover={true}
          />
        </PopoverView>
      ) : (
        <QuickForm
          addToDatabase={addToDatabase}
          isAddingNew={isAddingNew}
          newData={newData}
          handleChange={handleChange}
          toggleValue={toggleValue}
          inputPlaceholder={inputPlaceholder}
          addButtonLabel={addButtonLabel}
          saveButtonLabel={saveButtonLabel}
          cancelButtonLabel={cancelButtonLabel}
          isLoading={isLoading}
          isPopover={false}
        />
      )}
    </>
  );
}

const PopoverView = ({
  icon,
  label,
  children,
  classCustom,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  classCustom: string;
}) => {
  return (
    <SimplePopover
      title={
        <Button
          variant="outline"
          className="w-full text-wrap flex justify-start "
        >
          {icon} {label}
        </Button>
      }
      classCustom={classCustom}
    >
      <>
        <h2 className="text-center">{label}</h2>
        {children}
      </>
    </SimplePopover>
  );
};
