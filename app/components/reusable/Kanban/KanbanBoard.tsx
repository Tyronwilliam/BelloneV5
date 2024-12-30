"use client";

// DnD
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { AddColumn } from "./AddColumn";
import Container from "./Container";
import Items from "./Item";
import { DNDType } from "./KanbanView";
import { TaskInterfaceType } from "@/zodSchema/Project/tasks";

interface KanbanBoardProps {
  containers: DNDType[];
  sensors: any; // Type this properly based on your `DndContext` sensor configuration
  handleDragStart: (event: DragStartEvent) => void;
  handleDragMove: (event: DragMoveEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  inputTitleRef: React.RefObject<HTMLInputElement>;
  openChangeTitle: boolean;
  containerTitle: string;
  setContainerTitle: React.Dispatch<React.SetStateAction<string>>;
  changeContainerTitle?: (
    id: string | undefined,
    title: string | undefined
  ) => void;
  toggleChangeTitle: () => void;
  currentIdTitle: string | null;
  setCurrentIdTitle?: (value: string | null) => void;
  setShowAddItemModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentContainerId: React.Dispatch<React.SetStateAction<UniqueIdentifier>>;
  openEditor: boolean;
  toggleOpenEditor: () => void;
  currentTaskId: string | null;
  setCurrentTaskId?: (value: string | null) => void;
  taskTitle: string;
  setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  inputTaskRef: React.RefObject<HTMLInputElement>;
  openChangeTaskTitle: boolean;
  toggleChangeTaskTitle: () => void;
  handleChangeTaskTitle?: (
    containerId: string,
    id: string | undefined,
    title: string | undefined
  ) => void;
  activeId: string | string | null;
  findItemTitle: (id: string) => string;
  findContainerTitle: (id: string) => string;
  findContainerItems: (id: string | undefined) => any[];
}

const KanbanBoard = ({
  containers,
  sensors,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  inputTitleRef,
  openChangeTitle,
  containerTitle,
  setContainerTitle,
  changeContainerTitle,
  toggleChangeTitle,
  currentIdTitle,
  setCurrentIdTitle,
  setShowAddItemModal,
  setCurrentContainerId,
  openEditor,
  toggleOpenEditor,
  currentTaskId,
  setCurrentTaskId,
  taskTitle,
  setTaskTitle,
  inputTaskRef,
  openChangeTaskTitle,
  toggleChangeTaskTitle,
  handleChangeTaskTitle,
  activeId,
  findItemTitle,
  findContainerTitle,
  findContainerItems,
}: KanbanBoardProps) => {
  return (
    <div className="flex gap-4 h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={containers.map((container) => container.pseudo_id!)}
        >
          {containers
            .sort((a, b) => a.order - b.order)
            .map((container) => (
              <Container
                inputTitleRef={inputTitleRef}
                id={container.pseudo_id!}
                title={container.title}
                key={container.pseudo_id}
                onAddItem={() => {
                  setShowAddItemModal(true);
                  setCurrentContainerId(container.pseudo_id!);
                }}
                openChangeTitle={openChangeTitle}
                containerTitle={containerTitle}
                setContainerTitle={setContainerTitle}
                changeContainerTitle={changeContainerTitle}
                toggleChangeTitle={toggleChangeTitle}
                currentIdTitle={currentIdTitle}
                setCurrentIdTitle={setCurrentIdTitle}
                color={container?.color}
              >
                <SortableContext
                  items={container.items.map((i) => i.pseudo_id!)}
                >
                  {/* Container tasks */}
                  <div className="custom-scrollbar flex items-start flex-col gap-y-4 h-full max-h-[220px] overflow-y-scroll">
                    {container.items
                      .sort((a, b) => a.order - b.order)
                      .map((i: TaskInterfaceType) => (
                        <Items
                          key={i.pseudo_id!}
                          title={i.title}
                          pseudoId={i.pseudo_id!}
                          item={i}
                          containerId={container.pseudo_id!}
                          openEditor={openEditor}
                          toggleOpenEditor={toggleOpenEditor}
                          currentTaskId={currentTaskId}
                          setCurrentTaskId={setCurrentTaskId}
                          taskTitle={taskTitle}
                          setTaskTitle={setTaskTitle}
                          inputTaskRef={inputTaskRef}
                          openChangeTaskTitle={openChangeTaskTitle}
                          toggleChangeTaskTitle={toggleChangeTaskTitle}
                          handleChangeTaskTitle={handleChangeTaskTitle}
                          // collaborators={container?.collaborators}
                        />
                      ))}
                  </div>
                </SortableContext>
              </Container>
            ))}
        </SortableContext>{" "}
        <DragOverlay adjustScale={false}>
          {/* Drag Overlay For item Item */}
          {activeId && activeId.toString().includes("item") && (
            <Items pseudoId={activeId} title={findItemTitle(activeId)} />
          )}
          {/* Drag Overlay For Container */}
          {activeId && activeId.toString().includes("container") && (
            <Container
              id={activeId}
              title={findContainerTitle(activeId as string)}
            >
              {findContainerItems(activeId)?.map((i) => (
                <Items key={i.id} title={i.title} pseudoId={activeId} />
              ))}
            </Container>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
