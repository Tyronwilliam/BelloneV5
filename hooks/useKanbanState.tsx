import { DNDType } from "@/app/components/reusable/Kanban/KanbanView";
import { useState, useRef } from "react";
import { useToggle } from "./useToggle";
import useUpdateColumns from "./useUpdateColumns";
import useUpdateTasks from "./useUpdateTasks";
import { customFormatDate } from "@/utils/date";
import { getColumnsWithTasks } from "@/service/Task/api";
import { toast } from "./use-toast";

const useKanbanState = (project_id: string) => {
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
  const { handleUpdateColumns } = useUpdateColumns();
  const { handleUpdateTask, handleCreateTask } = useUpdateTasks();
  const inputTaskRef = useRef<HTMLInputElement | null>(null);
  const inputTitleRef = useRef<HTMLInputElement | null>(null);
  const [itemFormState, setItemFormState] = useState({
    project_id: "",
    title: "", // Le titre de l'item
    description: "", // Description vide initialement
    start_date: "", // La date de début de l'item
    due_date: "", // Date de fin vide initialement
    completed_at: null, // L'item n'est pas complété au début
    time: 0, // Temps initial à 0
    members: [], // Pas de membre au début
    column_id: "", // ID de la colonne associée
    order: null, // L'ordre est basé sur le nombre d'items existants
  });
  const onAddItem = async () => {
    if (!taskTitle) return; // If no item name is provided, do nothing
    const container = containers.find(
      (item) => item.pseudo_id === currentContainerId
    ); // Find the container based on currentContainerId
    if (!container) return; // If container is not found, do nothing
    console.log(currentContainerId, "CUrrent container");
    const response = await handleCreateTask({
      title: taskTitle,
      description: "",
      start_date: Date.now(),
      time: 0,
      // Put user id here
      members: ["675b1b5271482367aedba253"],
      column_id: container?.id as string,
      project_id,
      order: container?.items.length + 1,
    });
    console.log(response, "YO RESPONSE ");
    if (response?.data?.createTask) {
      const columnsWithTasks = await getColumnsWithTasks(project_id);
      setContainers(columnsWithTasks);
      setTaskTitle("");
      setShowAddItemModal(false);
      setCurrentContainerId(null);
    } else {
      toast({
        variant: "destructive",
        title: "Fail to create a new Item",
        description: "Error",
      });
    }
  };
  const onAddContainer = () => {
    if (!containerName) return;

    // Create functiion add container
    // setContainers([
    //   ...containers,
    //   {
    //     id,
    //     title: containerName,
    //     items: [],
    //     color: "",
    //     project_id: project_id,
    //     order: containers?.length + 1,
    //   },
    // ]);
    setContainerName("");
    setShowAddContainerModal(false);
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
    handleUpdateColumns,
    handleUpdateTask,
    inputTaskRef,
    inputTitleRef,
    onAddItem,
    onAddContainer,
  };
};

export default useKanbanState;
