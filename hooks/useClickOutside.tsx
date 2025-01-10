import { useEffect, RefObject } from "react";

type Handler = () => void;

/**
 * Hook pour gérer les clics en dehors d'un élément référencé
 * @param ref Référence de l'élément à surveiller
 * @param handler Fonction à exécuter lorsque le clic est en dehors
 * @param active Condition pour activer ou désactiver l'écoute
 */
function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  active: boolean = false
) {
  useEffect(() => {
    if (!active) return; 

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler, active]); 
}

export default useClickOutside;
