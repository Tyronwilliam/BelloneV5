"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientFormProps, ClientFormPropss } from "@/zodSchema/Client/type";
import { ClientSchema } from "@/zodSchema/Client/zodSchema";
import React from "react";
import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { SelectInput } from "./reusable/SelectInput";

const ClientSelect: React.FC<ClientFormProps> = ({
  isAddingNew,
  addClientToDatabase,
  newClientEmail,
  handleNewClientChange,
  toggleValue,
}) => {
  return (
    <div className="flex space-x-2 mt-2">
      {!isAddingNew ? (
        <Button onClick={toggleValue} type="button">
          Add New Client
        </Button>
      ) : (
        <div className="flex flex-col space-y-2">
          <Input
            value={newClientEmail}
            onChange={handleNewClientChange}
            placeholder="Enter new client email"
            className="w-full min-w-72"
            type="email"
          />
          <div className="flex gap-2 mt-2 items-center">
            <Button onClick={addClientToDatabase} type="button">
              Save Client
            </Button>
            <Button onClick={toggleValue} type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export function ClientForm<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  addClientToDatabase,
  isAddingNew,
  handleNewClientChange,
  newClientEmail,
  toggleValue,
}: ClientFormPropss<T>) {
  const clientOptions =
    options !== undefined
      ? options?.map((client: z.infer<typeof ClientSchema>) => ({
          value: client.id,
          label: client.email,
        }))
      : [];
  return (
    <React.Fragment key={"hello"}>
      {/* Select Component */}
      {clientOptions.length > 0 && (
        <SelectInput
          control={control}
          name={name}
          label={label}
          placeholder={placeholder}
          options={clientOptions}
        />
      )}

      <ClientSelect
        addClientToDatabase={addClientToDatabase}
        isAddingNew={isAddingNew}
        newClientEmail={newClientEmail}
        handleNewClientChange={handleNewClientChange}
        toggleValue={toggleValue}
      />
    </React.Fragment>
  );
}
