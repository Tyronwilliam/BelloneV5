import { DNDType } from "@/app/components/reusable/Kanban/KanbanView";
import ApiRequest from "@/service";
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
import { getColumnsWithTasks } from "@/app/(fonctionnality)/project/[id]/actions";

const userId = "676d57193e5d1eb79574e8d5";
const userEmail = "tyronwilliamchanu@gmail.com";
const useKanbanState = (project_id: string) => {
  const { mutateAsync: updateTaskMutation } =
    ApiRequest.Task.UpdateTask.useMutation();
  const {
    mutateAsync: createTaskMutation,
    isPending: createTaskPending,
    isSuccess: createTaskSuccess,
    isError: createTaskError,
  } = ApiRequest.Task.CreateTask.useMutation();
  const { mutateAsync: updateColumnMutation } =
    ApiRequest.Columns.UpdateColumn.useMutation();
  const {
    mutateAsync: createColumnMutation,
    isSuccess: createColumnSuccess,
    isError: createColumnError,
    isPending: createColumnPending,
  } = ApiRequest.Columns.CreateColumn.useMutation();
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
  const inputTaskRef = useRef<HTMLInputElement | null>(null);
  const inputTitleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputTitleRef?.current && inputTitleRef?.current?.focus();
  }, [toggleChangeTitle]);
  useEffect(() => {
    inputTaskRef?.current && inputTaskRef?.current?.focus();
  }, [toggleChangeTaskTitle]);

  const onAddItem = async () => {
    if (!taskTitle) return; 

    const container = containers.find(
      (container) => container.pseudo_id === currentContainerId
    ); 

    if (!container) return; 
    const res = await createTaskMutation({
      title: taskTitle,
      description: "",
      start_date: Date.now(),
      time: 0,
      members: [{ id: userId, email: userEmail }],
      column_id: container?.id as string,
      project_id,
      order: container?.items?.length + 1,
    });

    if (!createTaskPending && !createTaskError) {
      const columnsWithTasks = await getColumnsWithTasks(project_id);
      setShowAddItemModal(false);
      setCurrentContainerId(null);
      setTaskTitle("");
      setContainers(columnsWithTasks);
    }
  };
  const onAddContainer = async () => {
    if (!containerName) return;

    const response = await createColumnMutation({
      title: containerName,
      color: "",
      project_id,
      order: containers?.length + 1,
    });
    if (!createColumnPending && createColumnError) {
      const columnsWithTasks = await getColumnsWithTasks(project_id);
      setShowAddContainerModal(false);
      setContainerName("");
      setContainers(columnsWithTasks);
    }
  };
  async function handleChangeTaskTitle(
    containerId: string,
    taskId: string | undefined,
    title: string | undefined
  ) {
    if (!title || !containerId || !taskId) return;

    const trimmedTitle = title.trim();

    const indexContainer = containers?.findIndex(
      (container) => container?.pseudo_id === containerId
    );
    if (indexContainer === -1 || indexContainer === undefined) return;

    const container = containers[indexContainer];
    const itemToUpdate = container?.items?.find(
      (item) => item.pseudo_id === taskId
    );

    if (!itemToUpdate) return;

    if (trimmedTitle === itemToUpdate.title.trim()) return;

    const updatedContainers = containers.map((container) => {
      if (container.pseudo_id !== containerId) return container;

      return {
        ...container,
        items: container.items.map((item) => {
          if (item.pseudo_id !== taskId) return item;

          return {
            ...item,
            title: trimmedTitle,
          };
        }),
      };
    });

    await updateTaskMutation({
      id: itemToUpdate.id,
      title: trimmedTitle,
    });

    setTaskTitle(trimmedTitle);
    setContainers(updatedContainers);
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
              title: trimmedTitle, 
            }
          : container
      );

      await updateColumnMutation({
        id: containerToUpdate?.id as string,
        title: trimmedTitle, 
      });

      setContainers(updatedContainers); 

      setContainerTitle(trimmedTitle);
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
        const newContainers = [...containers]; 

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
    if (
      active.id.toString().includes("container") &&
      over.id.toString().includes("container") &&
      active.id !== over.id
    ) {
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
            await updateColumnMutation({
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
      updateTaskMutation({
        id: removedItem.id,
        column_id: newItems[overContainerIndex].id as string,
        order: newItems[overContainerIndex].items.length - 1, // Place it at the end of the new container's list
      });

      // Optionally update the tasks order in the source container if necessary
      newItems[activeContainerIndex].items.forEach(async (item, index) => {
        if (item.order !== index) {
          updateTaskMutation({
            id: item.id,
            column_id: newItems[activeContainerIndex].id as string,
            order: index,
          });
        }
      });

      // Optionally update the tasks order in the target container after the move
      newItems[overContainerIndex].items.forEach(async (item, index) => {
        if (item.order !== index) {
          updateTaskMutation({
            id: item.id,
            column_id: newItems[activeContainerIndex].id as string,
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
            updateTaskMutation({
              id: item.id,
              column_id: newItems[activeContainerIndex].id as string, // ID du container
              order: item.order,
            });
          })
        );

        // Mettez à jour l'état pour refléter les changements dans l'UI
        setContainers([...newItems]); // Créez une nouvelle référence pour forcer le re-render
      } else {
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
            updateTaskMutation({
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
            updateTaskMutation({
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

        updateTaskMutation({
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
    createTaskPending,
    createColumnPending,
  };
};

export default useKanbanState;
