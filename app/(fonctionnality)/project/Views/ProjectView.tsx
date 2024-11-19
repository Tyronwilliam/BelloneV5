"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToggle } from "@/hooks/useToggle";
import { CreateProjectForm } from "../Form/CreateProject";
import { ClientSchema } from "@/zodSchema/Client/zodSchema";
import { z } from "zod";
interface ProjectViewProps {
  clients: z.infer<typeof ClientSchema>[];
}
const EmptyProjectView = ({ clients }: ProjectViewProps) => {
  const { value, toggleValue } = useToggle();
  return (
    <section className="w-full h-full">
      <section className="w-full pt-9 flex items-center justify-center">
        <Card className="w-[90%]  lg:w-1/3">
          <CardHeader>
            <CardTitle className="text-center">
              It's empty here, create your first project
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!value ? (
              <Button onClick={toggleValue} className="mx-auto block">
                Let's go
              </Button>
            ) : (
              <CreateProjectForm clients={clients} />
            )}
          </CardContent>
        </Card>
      </section>
    </section>
  );
};

export default EmptyProjectView;
