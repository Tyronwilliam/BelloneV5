"use client";
import { useEffect } from "react";

// DnD

import { Button } from "@/components/ui/button";
import useKanbanState from "@/hooks/useKanbanState";
import { ColumnsTypeSchema } from "@/zodSchema/Kanban/columns";
import { TaskInterfaceType } from "@/zodSchema/Project/tasks";
import z from "@/zodSchema/zod";
import { AddTasks } from "./AddTasks";
import KanbanBoard from "./KanbanBoard";
import { AddColumn } from "./AddColumn";

// Components

export type DNDType = z.infer<typeof ColumnsTypeSchema> & {
  items: TaskInterfaceType[];
};

export default function KanbanView({
  projectId,
  columnsWithTasks,
}: {
  projectId: string;
  columnsWithTasks: DNDType[] | undefined;
}) {
  const {
    containers,
    setContainers,
    isClient,
    setIsClient,
    activeId,
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
  } = useKanbanState(projectId);

  useEffect(() => {
    setContainers(columnsWithTasks!);
    setIsClient(true); // Only set the state once the component is mounted in the client
  }, [columnsWithTasks]);

  if (!isClient) return null;
  return (
    <div className="mx-auto max-w-7xl h-full flex flex-col gap-5 pt-4">
      <AddTasks
        showAddItemModal={showAddItemModal}
        setShowAddItemModal={setShowAddItemModal}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        onAddItem={onAddItem}
        createTaskPending={createTaskPending}
      />{" "}
      <div className="flex gap-2 items-center">
        <Button className="w-fit">Background</Button>
        <AddColumn
          showAddContainerModal={showAddContainerModal}
          setShowAddContainerModal={setShowAddContainerModal}
          containerName={containerName}
          setContainerName={setContainerName}
          onAddContainer={onAddContainer}
          createColumnPending={createColumnPending}
        />
      </div>
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
          openEditor={openEditor}
          toggleOpenEditor={toggleOpenEditor}
        />
      </div>
    </div>
  );
}
