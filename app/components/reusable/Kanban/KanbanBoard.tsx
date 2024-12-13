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
    id: UniqueIdentifier | undefined,
    title: string | undefined
  ) => void;
  toggleChangeTitle: () => void;
  currentIdTitle: UniqueIdentifier | null;
  setCurrentIdTitle?: (value: UniqueIdentifier | null) => void;
  setShowAddItemModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentContainerId: React.Dispatch<
    React.SetStateAction<UniqueIdentifier | undefined>
  >;
  openEditor: boolean;
  toggleOpenEditor: () => void;
  currentTaskId: UniqueIdentifier | null;
  setCurrentTaskId?: (value: UniqueIdentifier | null) => void;
  taskTitle: string;
  setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  inputTaskRef: React.RefObject<HTMLInputElement>;
  openChangeTaskTitle: boolean;
  toggleChangeTaskTitle: () => void;
  handleChangeTaskTitle?: (
    containerId: UniqueIdentifier,
    id: UniqueIdentifier | undefined,
    title: string | undefined
  ) => void;
  showAddContainerModal: boolean;
  setShowAddContainerModal: React.Dispatch<React.SetStateAction<boolean>>;
  containerName: string;
  setContainerName: React.Dispatch<React.SetStateAction<string>>;
  onAddContainer: () => void;
  activeId: UniqueIdentifier | string | null;
  findItemTitle: (id: string) => string;
  findContainerTitle: (id: string) => string;
  findContainerItems: (id: UniqueIdentifier | undefined) => any[];
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
  showAddContainerModal,
  setShowAddContainerModal,
  containerName,
  setContainerName,
  onAddContainer,
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
        <SortableContext items={containers.map((container) => container.id)}>
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
              color={container?.color}
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
        </SortableContext>{" "}
        <AddColumn
          showAddContainerModal={showAddContainerModal}
          setShowAddContainerModal={setShowAddContainerModal}
          containerName={containerName}
          setContainerName={setContainerName}
          onAddContainer={onAddContainer}
        />
        <DragOverlay adjustScale={false}>
          {/* Drag Overlay For item Item */}
          {activeId && activeId.toString().includes("item") && (
            <Items id={activeId} title={findItemTitle(activeId as string)} />
          )}
          {/* Drag Overlay For Container */}
          {activeId && activeId.toString().includes("container") && (
            <Container
              id={activeId}
              title={findContainerTitle(activeId as string)}
            >
              {findContainerItems(activeId as string)?.map((i) => (
                <Items key={i.id} title={i.title} id={i.id} />
              ))}
            </Container>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
