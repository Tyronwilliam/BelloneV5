import React from "react";

export function useSelectableWithCreation(initialState = false) {
  const [isAddingNew, setIsAddingNew] = React.useState(initialState);
  const [newData, setNewData] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleValue = () => setIsAddingNew((prev) => !prev);
  const toggleIsLoading = () => setIsLoading((prev) => !prev);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewData(e.target.value);

  return {
    isAddingNew,
    toggleValue,
    newData,
    handleChange,
    isLoading,
    toggleIsLoading,
    reset: () => setNewData(""),
  };
}
