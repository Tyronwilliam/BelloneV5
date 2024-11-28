"use client";
import KanbanBoard from "@/app/components/reusable/Kanban/KanbanBoard";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Left = ({ data }: { data: any }) => {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={30}>One</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={70}
        className="custom-scrollbar overflow-x-scroll  py-4"
      >
        <div className="h-full">
          <KanbanBoard />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Left;
