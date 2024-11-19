import { useState } from "react";

export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const toggleValue = () => {
    setValue((prevValue) => !prevValue);
  };

  return { value, toggleValue };
};
