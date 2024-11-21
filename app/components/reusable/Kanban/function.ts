import { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
export const createHandleDragEnd =
  (containers: any, setContainers: any, setActiveId: any) =>
  (event: DragEndEvent) => {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container: any) => container.id === active.id
      );
      const overContainerIndex = containers.findIndex(
        (container: any) => container.id === over.id
      );
      // Swap the active and over container
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    // Handling task Sorting
    if (
      active.id.toString().includes("task") &&
      over?.id.toString().includes("task") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
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
    // Handling task dropping into Container
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

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].tasks.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].tasks.push(removeditem);
      setContainers(newItems);
    }
    setActiveId(null);
  };

// Find the value of the tasks
export function findValueOfItems(
  id: UniqueIdentifier | undefined,
  type: string,
  containers: any
) {
  if (type === "container") {
    return containers.find((task: any) => task.id === id);
  }
  if (type === "task") {
    return containers.find((container: any) =>
      container.tasks.find((task: any) => task.id === id)
    );
  }
}
