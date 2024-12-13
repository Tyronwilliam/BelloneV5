import { StickersType } from "@/zodSchema/Project/tasks";
import { fetchAll, getErrorMessage } from "../apiService";

export const getAllSticker = async () => {
  try {
    const stickers = await fetchAll<StickersType>("stickers");
    console.log(stickers);
    if (stickers?.length > 0) {
      return stickers;
    } else {
      console.warn("No stickers found");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des tâches :",
      getErrorMessage(error)
    );
    return undefined; 
  }
};
