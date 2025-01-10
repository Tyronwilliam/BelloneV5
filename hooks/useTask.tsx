import { DNDType } from "@/app/components/reusable/Kanban/KanbanView";
import ApiRequest from "@/service";
import { getColumnsWithTasks } from "@/service/Task/uncommon";
import { TaskInterfaceType } from "@/zodSchema/Project/tasks";
import { Dispatch, SetStateAction, useState } from "react";

interface UseTaskProps {
  updateTask: (updatedData: any) => Promise<void>;
  deleteTask: () => Promise<void>;
  createTask: (newTaskData: any) => Promise<void>;
  changeDate: (date: Date, arg: string) => Promise<void>;
  currentTask: TaskInterfaceType;
  setCurrentTask: Dispatch<SetStateAction<TaskInterfaceType>>;
}

export const useTask = (
  task: TaskInterfaceType,
  taskId: string,
  setContainers: React.Dispatch<React.SetStateAction<[] | DNDType[]>>,
  projectId: string,
  close: () => void,
  resetForm: (arg: string, value: any | undefined) => void
): UseTaskProps => {
  const [currentTask, setCurrentTask] = useState<TaskInterfaceType>(task);
  const { mutateAsync: updateTaskMutation } =
    ApiRequest.Task.UpdateTask.useMutation();
  const { mutateAsync: deleteTaskMutation } =
    ApiRequest.Task.DeleteTask.useMutation();
  const { mutateAsync: createTaskMutation } =
    ApiRequest.Task.CreateTask.useMutation();

  const updateTask = async (updatedData: any) => {
    try {
      await updateTaskMutation(updatedData);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const duplicateTask = async () => {
    try {
      const duplicatedTaskData = {
        ...task,
        id: undefined,
        title: `${task.title} (Copy)`,
        column_id: task.column_id,
      };
      await createTaskMutation(duplicatedTaskData);
      const columnsWithTasks = await getColumnsWithTasks(projectId);
      setContainers(columnsWithTasks);
      close();
    } catch (error) {
      console.error("Error duplicating task:", error);
    }
  };

  const trashTask = async () => {
    try {
      await deleteTaskMutation({ id: taskId });
      const columnsWithTasks = await getColumnsWithTasks(projectId);
      setContainers(columnsWithTasks);
      close();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const changeDate = async (date: Date, arg: string) => {
    const timestamp: number = date?.getTime();
    try {
      await updateTaskMutation({
        id: task?.id,
        [arg]: timestamp,
      });
      resetForm(arg, date);
    } catch (error) {
      console.error("Error update date:", error);
    }
  };
  return {
    updateTask,
    deleteTask: trashTask,
    createTask: duplicateTask,
    changeDate,
    currentTask,
    setCurrentTask,
  };
};
