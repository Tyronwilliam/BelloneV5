"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// DnD
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

import { Button } from "@/components/ui/button";
import { useToggle } from "@/hooks/useToggle";
import useUpdateColumns from "@/hooks/useUpdateColumns";
import { getColumnsWithTasks } from "@/service/Task/api";
import { customFormatDate } from "@/utils/date";
import { ColumnsTypeSchema } from "@/zodSchema/Kanban/columns";
import { ItemInterfaceType } from "@/zodSchema/Project/tasks";
import { useRef } from "react";
import { z } from "zod";
import { AddTasks } from "./AddTasks";
import KanbanBoard from "./KanbanBoard";
import useUpdateTasks from "@/hooks/useUpdateTasks";

// Components

export type DNDType = z.infer<typeof ColumnsTypeSchema> & {
  items: ItemInterfaceType[];
};

export default function KanbanView({
  projectId,
  columnsWithTasks,
}: {
  projectId: string;
  columnsWithTasks: DNDType[] | undefined;
}) {
  const [containers, setContainers] = useState<DNDType[] | []>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentContainerId, setCurrentContainerId] = useState<any>();
  const [containerName, setContainerName] = useState("");
  const [itemName, setItemName] = useState("");
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
  const { handleUpdateColumns } = useUpdateColumns();
  const { handleUpdateTask } = useUpdateTasks();
  const inputTaskRef = useRef<HTMLInputElement | null>(null);
  const inputTitleRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputTitleRef?.current && inputTitleRef?.current?.focus();
  }, [toggleChangeTitle]);
  useEffect(() => {
    inputTaskRef?.current && inputTaskRef?.current?.focus();
  }, [toggleChangeTaskTitle]);
  useEffect(() => {
    setContainers(columnsWithTasks!);
    setIsClient(true); // Only set the state once the component is mounted in the client
  }, [columnsWithTasks]);
  // useEffect(() => {
  //   if (containers.length > 0) {
  //     // Optionnel : Re-fetch des données si nécessaire
  //     getColumnsWithTasks(projectId).then((newColumns) => {
  //       setContainers(newColumns);
  //     });
  //   }
  // }, [containers]); // Cela se déclenche chaque fois que containers change
  const onAddContainer = () => {
    if (!containerName) return;

    // Create functiion add container
    const id = `container-${uuidv4()}`;
    setContainers([
      ...containers,
      {
        id,
        title: containerName,
        items: [],
        color: "",
        project_id: projectId,
        order: containers?.length + 1,
      },
    ]);
    setContainerName("");
    setShowAddContainerModal(false);
  };

  function handleChangeTaskTitle(
    containerId: string | undefined,
    taskId: string | undefined,
    title: string | undefined
  ) {
    if (title && containerId && taskId) {
      // Trim the title and toggle task title change state
      const trimmedTitle = title.trim();
      toggleChangeTaskTitle();

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

      setContainers(updatedContainers); // Update the state with new containers
    }
  }

  function changeContainerTitle(
    id: string | undefined,
    title: string | undefined
  ) {
    if (title) {
      toggleChangeTitle();

      const updateItemTitle = containers.map((item) =>
        item.pseudo_id === id ? { ...item, title: title.trim() } : item
      );
      containers?.map((item) => {
        item.pseudo_id === id &&
          title !== item.title &&
          handleUpdateColumns({
            id: id as unknown as string,
            title: title.trim(),
          });
      });

      setContainers(updateItemTitle);
    }
  }

  const onAddItem = () => {
    if (!itemName) return; // If no item name is provided, do nothing
    const id = `item-${uuidv4()}`; // Generate a unique id for the new item
    const container = containers.find(
      (item) => item.pseudo_id === currentContainerId
    ); // Find the container based on currentContainerId
    if (!container) return; // If container is not found, do nothing
    const formattedDate = customFormatDate(new Date()); // "en-CA" returns the date in YYYY-MM-DD format

    const newItem: ItemInterfaceType = {
      id, // Unique identifier for the item
      project_id: parseInt(projectId), // Set a default project_id or get it dynamically
      title: itemName, // Set the title from itemName
      description: "", // Optionally, you can allow for description input
      start_date: formattedDate, // Set a start date or use the current date
      due_date: "", // Set a due date or allow input from the user
      completed_at: null, // Initially, the task is not completed
      created_at: new Date().toISOString(), // Current timestamp for when the task is created
      updated_at: new Date().toISOString(), // Timestamp for when the task is updated
      time: 0, // Initial time spent is 0
      members: [], // Initially no members
      column_id: container?.id,
      order: container?.items?.length,
    };

    // Push the new item into the container's items array
    container.items.push(newItem);

    // Update the containers state with the new item added to the correct container
    setContainers([...containers]);

    // Reset the item name and close the modal
    setItemName("");
    setShowAddItemModal(false);
  };

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
        setContainers(newContainers);
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
        setContainers(newContainers);
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
        if (
          removedItem.column_id !== newItems[overContainerIndex].id ||
          removedItem.order !== overItemIndex
        ) {
          handleUpdateTask({
            id: removedItem.id,
            column_id: newItems[overContainerIndex].id as string,
            order: overItemIndex,
          });
        }
        setContainers(newItems);
      }
    }

    setActiveId(null);
  };

  if (!isClient) return null;
  return (
    <div className="mx-auto max-w-7xl h-full flex flex-col gap-5 pt-4">
      <AddTasks
        showAddItemModal={showAddItemModal}
        setShowAddItemModal={setShowAddItemModal}
        itemName={itemName}
        setItemName={setItemName}
        onAddItem={onAddItem}
      />
      <Button className="w-fit">Background</Button>
      {/* Kanban */}
      <div
        className="w-full overflow-x-scroll "
        style={{ height: "calc(100% - 36px)" }}
      >
        <KanbanBoard
          sensors={sensors}
          handleDragStart={handleDragStart}
          handleDragMove={handleDragMove}
          handleDragEnd={handleDragEnd}
          findItemTitle={findItemTitle}
          findContainerTitle={findContainerTitle}
          findContainerItems={findContainerItems}
          containers={containers}
          inputTaskRef={inputTaskRef}
          activeId={activeId}
          openChangeTitle={openChangeTitle}
          toggleChangeTitle={toggleChangeTitle}
          containerTitle={containerTitle}
          setContainerTitle={setContainerTitle}
          changeContainerTitle={changeContainerTitle}
          currentIdTitle={currentIdTitle}
          setCurrentIdTitle={setCurrentIdTitle}
          inputTitleRef={inputTitleRef}
          openChangeTaskTitle={openChangeTaskTitle}
          toggleChangeTaskTitle={toggleChangeTaskTitle}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          currentTaskId={currentTaskId}
          setCurrentTaskId={setCurrentTaskId}
          handleChangeTaskTitle={handleChangeTaskTitle}
          setShowAddItemModal={setShowAddItemModal}
          setCurrentContainerId={setCurrentContainerId}
          showAddContainerModal={showAddContainerModal}
          setShowAddContainerModal={setShowAddContainerModal}
          containerName={containerName}
          setContainerName={setContainerName}
          onAddContainer={onAddContainer}
          openEditor={openEditor}
          toggleOpenEditor={toggleOpenEditor}
        />
      </div>
    </div>
  );
}
