import DashboardLayout from "@/app/dashboard/layout";
import * as React from "react";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout children={children} />;
};

export default ProjectLayout;
