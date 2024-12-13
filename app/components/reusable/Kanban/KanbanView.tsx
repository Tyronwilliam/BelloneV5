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
import { customFormatDate } from "@/utils/date";
import { ColumnsTypeSchema } from "@/zodSchema/Kanban/columns";
import { ItemInterfaceType } from "@/zodSchema/Project/tasks";
import { useRef } from "react";
import { z } from "zod";
import { AddTasks } from "./AddTasks";
import KanbanBoard from "./KanbanBoard";

// Components

export type DNDType = z.infer<typeof ColumnsTypeSchema> & {
  items: ItemInterfaceType[];
};
const columns: DNDType[] = [
  {
    id: `container-${uuidv4()}`,
    title: "To Do",
    color: "#FFDAB9",
    project_id: 1,
    order: 3,
    items: [
      {
        id: `item-${uuidv4()}`,
        project_id: 1,
        title: "Task 1",
        description: "Design the wireframes for the homepage.",
        start_date: "2024-01-01",
        due_date: "2024-01-05",
        completed_at: null,
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-02T10:00:00Z",
        time: 3000,
        column_id: 1,
        members: [],
        order: 1,
      },
      {
        id: `item-${uuidv4()}`,
        project_id: 1,
        title: "Task 2",
        description: "Write the project proposal.",
        start_date: "2024-01-02",
        due_date: "2024-01-06",
        completed_at: null,
        created_at: "2024-01-02T08:00:00Z",
        updated_at: "2024-01-03T12:00:00Z",
        time: 4000,
        column_id: 1,
        order: 1,

        members: [],
      },
    ],
  },
  {
    id: `container-${uuidv4()}`,
    title: "In Progress",
    color: "#C9A0DC",
    project_id: 1,
    order: 3,

    items: [
      {
        id: `item-${uuidv4()}`,
        project_id: 2,
        title: "Task 3",
        description: "Create the user login form.",
        start_date: "2024-01-05",
        due_date: "2024-01-10",
        completed_at: null,
        created_at: "2024-01-05T09:00:00Z",
        updated_at: "2024-01-07T14:00:00Z",
        time: 5000,
        column_id: 2,
        order: 1,

        members: [],
      },
      {
        id: `item-${uuidv4()}`,
        project_id: 2,
        title: "Task 4",
        description: "Develop the backend API for user authentication.",
        start_date: "2024-01-06",
        due_date: "2024-01-11",
        completed_at: null,
        created_at: "2024-01-06T10:00:00Z",
        updated_at: "2024-01-08T15:00:00Z",
        time: 6000,
        column_id: 2,
        order: 1,

        members: [],
      },
    ],
  },
  {
    id: `container-${uuidv4()}`,
    title: "Done",
    color: "#B8D9C8",
    project_id: 1,
    order: 3,

    items: [
      {
        id: `item-${uuidv4()}`,
        project_id: 3,
        title: "Task 5",
        description: "Finish the user registration flow.",
        start_date: "2024-01-10",
        due_date: "2024-01-15",
        completed_at: "2024-01-14T17:00:00Z",
        created_at: "2024-01-10T08:00:00Z",
        updated_at: "2024-01-14T16:00:00Z",
        time: 2000,
        column_id: 3,
        order: 1,

        members: [],
      },
      {
        id: `item-${uuidv4()}`,
        project_id: 3,
        title: "Task 6",
        description: "Finalize the project documentation.",
        start_date: "2024-01-12",
        due_date: "2024-01-16",
        completed_at: "2024-01-15T18:00:00Z",
        created_at: "2024-01-12T08:00:00Z",
        updated_at: "2024-01-15T17:00:00Z",
        time: 3500,
        column_id: 3,
        order: 1,

        members: [],
      },
    ],
  },
];

export default function KanbanView({
  projectId,
  columnsWithTasks,
}: {
  projectId: string;
  columnsWithTasks: DNDType[] | undefined;
}) {
  const [containers, setContainers] = useState<DNDType[]>(columnsWithTasks!);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
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
  const [currentIdTitle, setCurrentIdTitle] = useState<UniqueIdentifier | null>(
    null
  );
  const [currentTaskId, setCurrentTaskId] = useState<UniqueIdentifier | null>(
    null
  );
  const [taskTitle, setTaskTitle] = useState("");

  const inputTaskRef = useRef<HTMLInputElement | null>(null);
  const inputTitleRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputTitleRef?.current && inputTitleRef?.current?.focus();
  }, [toggleChangeTitle]);
  useEffect(() => {
    inputTaskRef?.current && inputTaskRef?.current?.focus();
  }, [toggleChangeTaskTitle]);

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
    containerId: UniqueIdentifier | undefined,
    taskId: UniqueIdentifier | undefined,
    title: string | undefined
  ) {
    if (title && containerId && taskId) {
      // Trim the title and toggle task title change state
      const trimmedTitle = title.trim();
      toggleChangeTaskTitle();

      // Update the containers state with the modified task title
      const updatedContainers = containers.map((container) =>
        // Find the container by id
        container.id === containerId
          ? {
              ...container,
              items: container.items.map((item) =>
                // Find the task within the container by its id and update the title
                item.id === taskId ? { ...item, title: trimmedTitle } : item
              ),
            }
          : container
      );

      setContainers(updatedContainers); // Update the state with new containers
    }
  }

  function changeContainerTitle(
    id: UniqueIdentifier | undefined,
    title: string | undefined
  ) {
    if (title) {
      toggleChangeTitle();

      const updateItemTitle = containers.map((item) =>
        item.id === id ? { ...item, title: title.trim() } : item
      );
      setContainers(updateItemTitle);
    }
  }

  const onAddItem = () => {
    if (!itemName) return; // If no item name is provided, do nothing
    const id = `item-${uuidv4()}`; // Generate a unique id for the new item
    const container = containers.find((item) => item.id === currentContainerId); // Find the container based on currentContainerId
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
      if (type === "container" && container.id === id) {
        return container;
      }
      if (type === "item") {
        const item = container.items.find((item) => item.id === id);
        if (item) return container;
      }
    }
    return null;
  };
  const findItemTitle = (id: UniqueIdentifier | string | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.id === id);
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
    setActiveId(id);
  }

  // Handle Drag Move
  const handleDragMove = (event: DragMoveEvent) => {
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
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );
      console.log(overItemIndex, "overItemIndex");
      console.log(activeItemIndex, "activeItemIndex");
      if (activeContainerIndex === overContainerIndex) {
        // Within the same container
        const newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeItemIndex,
          overItemIndex
        );
        console.log(overItemIndex, "overItemIndex END ");
        console.log(activeItemIndex, "activeItemIndex END");
        console.log(newItems, "NEW ITEMS");
        setContainers(newItems);
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
        setContainers(newItems);
      }
    }
  };

  // Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (
      active.id.toString().includes("container") &&
      over.id.toString().includes("container") &&
      active.id !== over.id
    ) {
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id
      );

      if (activeContainerIndex !== overContainerIndex) {
        const newItems = arrayMove(
          containers,
          activeContainerIndex,
          overContainerIndex
        );
        setContainers(newItems);
      }
    } else if (
      active.id.toString().includes("item") &&
      over.id.toString().includes("container")
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      console.log(activeItemIndex, "activeItemIndex");
      const newItems = [...containers];
      const [removedItem] = newItems[activeContainerIndex].items.splice(
        activeItemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removedItem);

      setContainers(newItems);
    }

    setActiveId(null);
  };

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
