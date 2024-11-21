import { DragMoveEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { findValueOfItems } from "./function";

export const createHandleDragMove =
  (containers: any, setContainers: any, setActiveId: any) =>
  (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes("task") &&
      over?.id.toString().includes("task") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, "task", containers);
      const overContainer = findValueOfItems(over.id, "task", containers);

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container: any) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container: any) => container.id === overContainer.id
      );

      // Find the index of the active and over task
      const activeitemIndex = activeContainer.tasks.findIndex(
        (task: any) => task.id === active.id
      );
      const overitemIndex = overContainer.tasks.findIndex(
        (task: any) => task.id === over.id
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].tasks = arrayMove(
          newItems[activeContainerIndex].tasks,
          activeitemIndex,
          overitemIndex
        );

        setContainers(newItems);
      } else {
        // In different containers
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].tasks.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].tasks.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("task") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "task", containers);
      const overContainer = findValueOfItems(over.id, "container", containers);

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container: any) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container: any) => container.id === overContainer.id
      );

      // Find the index of the active and over task
      const activeitemIndex = activeContainer.tasks.findIndex(
        (task: any) => task.id === active.id
      );

      // Remove the active task from the active container and add it to the over container
      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].tasks.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].tasks.push(removeditem);
      setContainers(newItems);
    }
  };
