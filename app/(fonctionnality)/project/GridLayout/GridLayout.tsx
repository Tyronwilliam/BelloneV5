import React from "react";
import Left from "./Left";

const GridLayout = ({ tasks, kanban }: { tasks: any; kanban: any }) => {
  return (
    <section
      className="grid grid-cols-5 grid-rows-5  w-full min-w-[1400px]"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="h-full col-span-4 row-span-5  border-2 p-2">
        <Left tasks={tasks} kanban={kanban} />
      </div>
      <div className="row-span-5 col-start-5  border-2 p-2">2</div>
    </section>
  );
};

export default GridLayout;
