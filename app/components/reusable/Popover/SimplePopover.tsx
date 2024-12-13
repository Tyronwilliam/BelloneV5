import { ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactElement, ReactNode } from "react";

const SimplePopover = ({
  title,
  children,
  classCustom,
}: {
  title: string | ReactElement<ButtonProps>;
  children: ReactNode;
  classCustom: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger className={`${classCustom}`} asChild>
        {title}
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

export default SimplePopover;
