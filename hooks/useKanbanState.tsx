import { DNDType } from "@/app/components/reusable/Kanban/KanbanView";
import { getColumnsWithTasks } from "@/service/Task/api";
import {
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { toast } from "./use-toast";
import { useToggle } from "./useToggle";
import useUpdateColumns from "./useUpdateColumns";
import useUpdateTasks from "./useUpdateTasks";

const useKanbanState = (project_id: string) => {
  const [containers, setContainers] = useState<DNDType[] | []>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentContainerId, setCurrentContainerId] = useState<any>();
  const [containerName, setContainerName] = useState("");
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [containerTitle, setContainerTitle] = useState("");
  const { value: openChangeTitle, toggleValue: toggleChangeTitle } =
    useToggle();
  const { value: openChangeTaskTitle, toggleValue: toggleChangeTaskTitle } =
    useToggle();
  const { value: openEditor, toggleValue: toggleOpenEditor } = useToggle();
  const [currentIdTitle, setCurrentIdTitle] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const { handleUpdateColumns, handleCreateColumn } = useUpdateColumns();
  const { handleUpdateTask, handleCreateTask } = useUpdateTasks();
  const inputTaskRef = useRef<HTMLInputElement | null>(null);
  const inputTitleRef = useRef<HTMLInputElement | null>(null);
  const [itemFormState, setItemFormState] = useState({
    project_id: "",
    title: "", // Le titre de l'item
    description: "", // Description vide initialement
    start_date: "", // La date de début de l'item
    due_date: "", // Date de fin vide initialement
    completed_at: null, // L'item n'est pas complété au début
    time: 0, // Temps initial à 0
    members: [], // Pas de membre au début
    column_id: "", // ID de la colonne associée
    order: null, // L'ordre est basé sur le nombre d'items existants
  });
  useEffect(() => {
    inputTitleRef?.current && inputTitleRef?.current?.focus();
  }, [toggleChangeTitle]);
  useEffect(() => {
    inputTaskRef?.current && inputTaskRef?.current?.focus();
  }, [toggleChangeTaskTitle]);

  const onAddItem = async () => {
    if (!taskTitle) return; // If no item name is provided, do nothing
    const container = containers.find(
      (item) => item.pseudo_id === currentContainerId
    ); // Find the container based on currentContainerId
    if (!container) return; // If container is not found, do nothing
    const response = await handleCreateTask({
      title: taskTitle,
      description: "",
      start_date: Date.now(),
      time: 0,
      // Put user id here
      members: ["675b1b5271482367aedba253"],
      column_id: container?.id as string,
      project_id,
      order: container?.items.length + 1,
    });
    if (response?.data?.createTask) {
      const columnsWithTasks = await getColumnsWithTasks(project_id);
      setContainers(columnsWithTasks);
      setTaskTitle("");
      setShowAddItemModal(false);
      setCurrentContainerId(null);
    } else {
      toast({
        variant: "destructive",
        title: "Fail to create a new Item",
        description: "Error",
      });
    }
  };
  const onAddContainer = async () => {
    if (!containerName) return;

    const response = await handleCreateColumn({
      title: containerName,
      color: "",
      project_id,
      order: containers?.length + 1,
    });
    console.log(response, "ADD COLUMNS");
    if (response?.data?.data?.addColumn) {
      const columnsWithTasks = await getColumnsWithTasks(project_id);
      setContainers(columnsWithTasks);
      setContainerName("");
      setShowAddContainerModal(false);
    } else {
      toast({
        variant: "destructive",
        title: "Fail to create a new Column",
        description: "Error",
      });
    }
  };
  async function handleChangeTaskTitle(
    containerId: string | undefined,
    taskId: string | undefined,
    title: string | undefined
  ) {
    if (title && containerId && taskId) {
      // Trim the title and toggle task title change state
      const trimmedTitle = title.trim();
      const indexContainer = containers?.findIndex(
        (container) => container?.pseudo_id === containerId
      );
      const itemToUpdate = containers[indexContainer]?.items?.filter(
        (item) => item.pseudo_id === taskId
      );
      if (trimmedTitle === itemToUpdate[0].title.trim()) {
        return;
      }
      // Update the containers state with the modified task title
      const updatedContainers = containers.map((container) =>
        // Find the container by id
        container.pseudo_id === containerId
          ? {
              ...container,
              items: container.items.map((item) =>
                // Find the task within the container by its id and update the title
                item.pseudo_id === taskId
                  ? { ...item, title: trimmedTitle }
                  : item
              ),
            }
          : container
      );

      await handleUpdateTask({
        id: itemToUpdate[0].id,
        title: trimmedTitle,
      });
      setTaskTitle(trimmedTitle);
      setContainers(updatedContainers); // Update the state with new containers
    }
  }
  async function changeContainerTitle(
    id: string | undefined,
    title: string | undefined
  ) {
    if (title && id) {
      const trimmedTitle = title.trim();
      const containerToUpdate = containers.find(
        (container) => container.pseudo_id === id
      );
      if (!containerToUpdate) {
        return;
      }
      if (containerToUpdate.title.trim() === trimmedTitle) {
        return;
      }
      const updatedContainers = containers.map((container) =>
        container.pseudo_id === id
          ? {
              ...container,
              title: trimmedTitle, // Update the title of the matched container
            }
          : container
      );

      await handleUpdateColumns({
        id: containerToUpdate?.id as string, // Pass the container's pseudo_id as the id
        title: trimmedTitle, // Pass the updated title
      });

      setContainers(updatedContainers); // Update the containers state with the new container title

      setContainerTitle(trimmedTitle); // Update containerTitle state
    }
  }
  const findValueOfItems = (
    id: UniqueIdentifier | undefined,
    type: "item" | "container"
  ) => {
    for (const container of containers) {
      if (type === "container" && container.pseudo_id === id) {
        return container;
      }
      if (type === "item") {
        const item = container.items.find((item) => item.pseudo_id === id);
        if (item) return container;
      }
    }
    return null;
  };
  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.pseudo_id === id);
    if (!item) return "";
    return item.title;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return [];
    return container.items;
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    //@ts-ignore
    setActiveId(id);
  }
  const handleDragMove = async (event: DragMoveEvent) => {
    const { active, over } = event;
    if (!over) return;
    console.log("Active DRAGMOVE : ", active, "DRAG OVEr : ", over);

    if (
      active.id.toString().includes("item") &&
      over.id.toString().includes("item") &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) =>
          String(container.pseudo_id) === String(activeContainer.pseudo_id)
      );
      const overContainerIndex = containers.findIndex((container) => {
        return String(container.pseudo_id) === String(overContainer.pseudo_id);
      });

      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.pseudo_id === active.id
      );
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.pseudo_id === over.id
      );

      if (activeContainerIndex === overContainerIndex) {
        // Déplacement au sein du même container
        const newContainers = [...containers]; // Copie immuable des containers

        // Réorganisation des items dans le container actif
        const updatedItems = arrayMove(
          newContainers[activeContainerIndex].items, // Items dans le container actif
          activeItemIndex, // Index de l'item déplacé
          overItemIndex // Nouvel index pour l'item déplacé
        );

        // Mise à jour des items du container actif
        newContainers[activeContainerIndex] = {
          ...newContainers[activeContainerIndex],
          items: updatedItems, // Remplace les anciens items par les nouveaux
        };

        // Prévisualisation de la mise à jour
        // setContainers(newContainers);
      } else {
        // Déplacement entre deux containers différents
        const newContainers = [...containers]; // Copie immuable des containers

        // Retirer l'item du container actif
        const [removedItem] = newContainers[activeContainerIndex].items.splice(
          activeItemIndex, // Index de l'item déplacé dans le container actif
          1 // Supprimer un seul élément
        );

        // Ajouter l'item dans le nouveau container
        newContainers[overContainerIndex].items.splice(
          overItemIndex, // Nouvel index dans le container cible
          0, // Aucun élément à remplacer
          removedItem // Ajouter l'item déplacé
        );

        // Mise à jour des containers pour prévisualisation
        // setContainers(newContainers);
      }
    }
  };
  //////

  // Handle Drag End
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    console.log(active, "oVEr : ", over);
    if (
      active.id.toString().includes("container") &&
      over.id.toString().includes("container") &&
      active.id !== over.id
    ) {
      console.log("CONTAINER & CONTAINER");

      const activeContainerIndex = containers.findIndex(
        (container) => container.pseudo_id === active.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.pseudo_id === over.id
      );

      if (activeContainerIndex !== overContainerIndex) {
        // Utiliser `arrayMove` pour déplacer les colonnes dans le tableau
        const newContainers = arrayMove(
          [...containers], // Crée une copie immuable des containers
          activeContainerIndex,
          overContainerIndex
        );

        // Met à jour l'ordre des colonnes localement
        newContainers.forEach((container, index) => {
          container.order = index; // Met à jour la propriété `order` de chaque colonne
        });

        // Synchroniser les changements avec le backend
        await Promise.all(
          newContainers.map(async (container) => {
            await handleUpdateColumns({
              id: container.id as string, // ID de la colonne
              order: container.order, // Nouvel ordre de la colonne
            });
          })
        );
        // Mettre à jour l'état pour refléter les changements dans l'UI
        setContainers(newContainers); // Met à jour les containers avec leur nouvelle position
      }
    } else if (
      active.id.toString().includes("item") &&
      over.id.toString().includes("container")
    ) {
      console.log("ITEM & CONTAINER");
      console.log("FRERE");

      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.pseudo_id === activeContainer.pseudo_id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.pseudo_id === overContainer.pseudo_id
      );

      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.pseudo_id === active.id
      );
      const newItems = [...containers];
      const [removedItem] = newItems[activeContainerIndex].items.splice(
        activeItemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removedItem);
      // After updating the UI, update the backend

      // Update the task's column_id and order in the target container
      await handleUpdateTask({
        id: removedItem.id,
        column_id: newItems[overContainerIndex].id as string,
        order: newItems[overContainerIndex].items.length - 1, // Place it at the end of the new container's list
      });

      // Optionally update the tasks order in the source container if necessary
      newItems[activeContainerIndex].items.forEach(async (item, index) => {
        if (item.order !== index) {
          await handleUpdateTask({
            id: item.id,
            column_id: newItems[activeContainerIndex].id as string,
            order: index,
          });
        }
      });

      // Optionally update the tasks order in the target container after the move
      newItems[overContainerIndex].items.forEach(async (item, index) => {
        if (item.order !== index) {
          await handleUpdateTask({
            id: item.id,
            column_id: newItems[overContainerIndex].id as string,
            order: index,
          });
        }
      });
      setContainers(newItems);
    }
    /////////////////////////////////////////////////////////////////////////////////////
    if (
      active.id.toString().includes("item") &&
      over.id.toString().includes("item") &&
      active.id !== over.id
    ) {
      console.log("ITEM & ITEM ");
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");
      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) =>
          String(container.pseudo_id) === String(activeContainer.pseudo_id)
      );
      const overContainerIndex = containers.findIndex((container) => {
        return String(container.pseudo_id) === String(overContainer.pseudo_id);
      });

      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.pseudo_id === active.id
      );
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.pseudo_id === over.id
      );

      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers]; // Crée une copie du tableau des containers

        // Récupérez les items du container actif
        const items = [...newItems[activeContainerIndex].items]; // Crée une copie des items

        // Identifiez les items à intervertir
        const activeItem = items[activeItemIndex]; // L'item déplacé
        const overItem = items[overItemIndex]; // L'item avec lequel il est échangé

        // Échangez les propriétés `order` des deux items
        const tempOrder = activeItem.order; // Sauvegardez temporairement l'ordre de l'item actif
        activeItem.order = overItem.order; // L'item actif prend l'ordre de l'item cible
        overItem.order = tempOrder; // L'item cible prend l'ordre initial de l'item actif

        // Remplacez les items dans le tableau à leurs nouvelles positions
        items[activeItemIndex] = { ...activeItem };
        items[overItemIndex] = { ...overItem };

        // Mettez à jour les items dans le container actif
        newItems[activeContainerIndex] = {
          ...newItems[activeContainerIndex],
          items, // Remplacez l'ancien tableau d'items par le nouveau
        };

        // Mettez à jour les ordres dans le backend
        await Promise.all(
          newItems[activeContainerIndex].items.map(async (item) => {
            await handleUpdateTask({
              id: item.id,
              column_id: newItems[activeContainerIndex].id as string, // ID du container
              order: item.order, // Nouvel ordre de l'item
            });
          })
        );

        // Mettez à jour l'état pour refléter les changements dans l'UI
        setContainers([...newItems]); // Créez une nouvelle référence pour forcer le re-render
      } else {
        console.log("BETWEEN CONTAINER");
        // Between different containers
        const newItems = [...containers];
        const [removedItem] = newItems[activeContainerIndex].items.splice(
          activeItemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overItemIndex,
          0,
          removedItem
        );

        // Update the moved task in the backend
        // Update orders for the source container
        newItems[activeContainerIndex].items.forEach((item, index) => {
          // Vérifie si l'ordre a changé avant d'envoyer la requête
          if (item.order !== index) {
            handleUpdateTask({
              id: item.id,
              column_id: newItems[activeContainerIndex].id as string,
              order: index,
            });
          }
        });

        // Update orders for the target container
        newItems[overContainerIndex].items.forEach((item, index) => {
          // Vérifie si l'ordre a changé avant d'envoyer la requête
          if (item.order !== index) {
            handleUpdateTask({
              id: item.id,
              column_id: newItems[overContainerIndex].id as string,
              order: index,
            });
          }
        });

        // Vérifie si la tâche déplacée a réellement changé de colonne ou d'ordre
        // if (
        //   removedItem.column_id !== newItems[overContainerIndex].id ||
        //   removedItem.order !== overItemIndex
        // ) {
        console.log("BETWEEN CONTAINER");

        handleUpdateTask({
          id: removedItem.id,
          column_id: newItems[overContainerIndex].id as string,
          order: overItemIndex,
        });
        // }
        setContainers(newItems);
      }
    }

    setActiveId(null);
  };
  // Expose everything as an object
  return {
    containers,
    setContainers,
    isClient,
    setIsClient,
    activeId,
    setActiveId,
    currentContainerId,
    setCurrentContainerId,
    containerName,
    setContainerName,
    showAddContainerModal,
    setShowAddContainerModal,
    showAddItemModal,
    setShowAddItemModal,
    containerTitle,
    setContainerTitle,
    openChangeTitle,
    toggleChangeTitle,
    openChangeTaskTitle,
    toggleChangeTaskTitle,
    openEditor,
    toggleOpenEditor,
    currentIdTitle,
    setCurrentIdTitle,
    currentTaskId,
    setCurrentTaskId,
    taskTitle,
    setTaskTitle,
    handleUpdateColumns,
    handleUpdateTask,
    inputTaskRef,
    inputTitleRef,
    onAddItem,
    onAddContainer,
    handleChangeTaskTitle,
    changeContainerTitle,
    sensors,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    findItemTitle,
    findContainerItems,
    findContainerTitle,
  };
};

export default useKanbanState;
