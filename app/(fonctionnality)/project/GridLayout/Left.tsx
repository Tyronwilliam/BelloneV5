"use client";
import KanbanView, {
  DNDType,
} from "@/app/components/reusable/Kanban/KanbanView";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { KanbanType } from "@/zodSchema/Kanban/kanban";
import Image from "next/image";

const Left = ({
  kanban,
  projectId,
  columnsWithTasks,
}: {
  kanban: KanbanType;
  projectId: string;
  columnsWithTasks: DNDType[] | undefined;
}) => {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={30}>One</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={70}
        className="custom-scrollbar overflow-x-scroll "
      >
        <div className="h-full w-full relative px-2 ">
          {kanban?.image && (
            <Image
              src={kanban?.image}
              alt="image"
              className="absolute object-cover -z-10 w-[95%] h-[90%] pt-2 rounded-sm"
              fill
              unoptimized={true}
            />
          )}
          {columnsWithTasks && columnsWithTasks?.length > 0 && (
            <KanbanView
              projectId={projectId}
              columnsWithTasks={columnsWithTasks}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Left;
