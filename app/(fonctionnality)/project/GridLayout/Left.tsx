"use client";
import KanbanBoard from "@/app/components/reusable/DragBox/KanbanBoard";
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
        className="custom-scrollbar h-full overflow-x-scroll"
      >
        <KanbanBoard />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Left;
