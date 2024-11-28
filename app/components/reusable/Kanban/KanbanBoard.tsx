"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// DnD
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { useToggle } from "@/hooks/useToggle";
import { useRef } from "react";
import { AddColumn } from "./AddColumn";
import { AddTasks } from "./AddTasks";
import Container from "./Container";
import Items from "./Item";

// Components

export type DNDType = {
  id: UniqueIdentifier;
  title: string;
  color: string;
  items: {
    id: UniqueIdentifier;
    title: string;
  }[];
};
const columns: DNDType[] = [
  {
    id: `container-${uuidv4()}`, // Unique identifier for the column
    title: "To Do", // Column name
    color: "",
    items: [
      { id: `item-${uuidv4()}`, title: "Task 1" },
      { id: `item-${uuidv4()}`, title: "Task 2" },
    ],
  },
  {
    id: `container-${uuidv4()}`, // Unique identifier for the column
    title: "In Progress", // Column name
    color: "",

    items: [
      { id: `item-${uuidv4()}`, title: "Task 3" },
      { id: `item-${uuidv4()}`, title: "Task 4" },
    ],
  },
  {
    id: `container-${uuidv4()}`, // Unique identifier for the column
    title: "Done", // Column name
    color: "",
    items: [
      { id: `item-${uuidv4()}`, title: "Task 5" },
      { id: `item-${uuidv4()}`, title: "Task 6" },
    ],
  },
];
export default function KanbanBoard() {
  const [containers, setContainers] = useState<DNDType[]>(columns);
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
  const onAddContainer = () => {
    if (!containerName) return;
    const id = `container-${uuidv4()}`;
    setContainers([
      ...containers,
      {
        id,
        title: containerName,
        items: [],
        color: "",
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
    if (!itemName) return;
    const id = `item-${uuidv4()}`;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    container.items.push({
      id,
      title: itemName,
    });
    setContainers([...containers]);
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
  const findItemTitle = (id: UniqueIdentifier | undefined) => {
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

      if (activeContainerIndex === overContainerIndex) {
        // Within the same container
        const newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeItemIndex,
          overItemIndex
        );
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
    <div className="mx-auto max-w-7xl py-10 h-full custom-scrollbar">
      <section className="flex gap-3">
        {/* Add Column Modal */}
        <AddColumn
          showAddContainerModal={showAddContainerModal}
          setShowAddContainerModal={setShowAddContainerModal}
          containerName={containerName}
          setContainerName={setContainerName}
          onAddContainer={onAddContainer}
        />
        {/* Add Item Modal */}
        <AddTasks
          showAddItemModal={showAddItemModal}
          setShowAddItemModal={setShowAddItemModal}
          itemName={itemName}
          setItemName={setItemName}
          onAddItem={onAddItem}
        />
      </section>
      {/* Kanban */}
      <div className="mt-10 pb-5 custom-scrollbar overflow-x-scroll ">
        <div className="flex gap-4 h-full ">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={containers.map((container) => container.id)}
            >
              {containers.map((container) => (
                <Container
                  inputTitleRef={inputTitleRef}
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  onAddItem={() => {
                    setShowAddItemModal(true);
                    setCurrentContainerId(container.id);
                  }}
                  openChangeTitle={openChangeTitle}
                  containerTitle={containerTitle}
                  setContainerTitle={setContainerTitle}
                  changeContainerTitle={changeContainerTitle}
                  toggleChangeTitle={toggleChangeTitle}
                  currentIdTitle={currentIdTitle}
                  setCurrentIdTitle={setCurrentIdTitle}
                >
                  <SortableContext items={container.items.map((i) => i.id)}>
                    {/* Container tasks */}
                    <div className="custom-scrollbar flex items-start flex-col gap-y-4 h-full max-h-[220px] overflow-y-scroll">
                      {container.items.map((i) => (
                        <Items
                          key={i.id}
                          title={i.title}
                          id={i.id}
                          item={i}
                          containerId={container?.id}
                          open={openEditor}
                          close={toggleOpenEditor}
                          currentTaskId={currentTaskId}
                          setCurrentTaskId={setCurrentTaskId}
                          taskTitle={taskTitle}
                          setTaskTitle={setTaskTitle}
                          inputTaskRef={inputTaskRef}
                          openChangeTaskTitle={openChangeTaskTitle}
                          toggleChangeTaskTitle={toggleChangeTaskTitle}
                          handleChangeTaskTitle={handleChangeTaskTitle}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes("item") && (
                <Items id={activeId} title={findItemTitle(activeId)} />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("container") && (
                <Container id={activeId} title={findContainerTitle(activeId)}>
                  {findContainerItems(activeId).map((i) => (
                    <Items key={i.id} title={i.title} id={i.id} />
                  ))}
                </Container>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
