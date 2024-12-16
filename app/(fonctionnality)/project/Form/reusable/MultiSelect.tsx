"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Ensure you have this utility to handle conditional class names
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Define the type for the option
interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[]; // Options for the select dropdown
  value: Option[]; // Selected values
  onChange: (selected: Option[]) => void; // Callback to handle selected items
  placeholder?: string; // Optional placeholder for the button
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value.length > 0 ? `${value.length} selected` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  const newSelection = value.some((item) => item === option)
                    ? value.filter((item) => item !== option)
                    : [...value, option];
                  onChange(newSelection); // Call onChange to update the selected values
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.some((item) => item === option)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((item) => (
          <Badge key={item.value} variant="secondary">
            {item.label}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => {
                const newSelection = value.filter(
                  (i) => i.value !== item.value
                );
                onChange(newSelection); // Call onChange to update the selected values
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </Badge>
        ))}
      </div>
    </Popover>
  );
}
