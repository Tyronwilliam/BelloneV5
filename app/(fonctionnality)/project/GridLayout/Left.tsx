"use client";
import KanbanBoard from "@/app/components/reusable/Kanban/KanbanBoard";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";

const Left = ({ tasks, kanban }: { tasks: any; kanban: any }) => {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={30}>One</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={70}
        className="custom-scrollbar overflow-x-scroll "
      >
        <div className="h-full w-full relative px-2 ">
          <Image
            src={kanban?.image}
            alt="image"
            className="absolute object-cover -z-10 w-[95%] h-[90%] pt-2 rounded-sm"
            fill
            unoptimized={true}
          />
          <KanbanBoard />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Left;
