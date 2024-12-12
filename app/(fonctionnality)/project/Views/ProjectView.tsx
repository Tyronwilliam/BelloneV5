"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToggle } from "@/hooks/useToggle";
import { CreateProjectForm } from "../Form/CreateProjectForm";
import { ClientSchema } from "@/zodSchema/Client/zodSchema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { IoMdClose } from "react-icons/io";

interface ProjectViewProps {
  clients: z.infer<typeof ClientSchema>[];
  isProjectMoreThan0: boolean;
}

const FirstPROJECT = "It's empty here, create your first project";
const YesPROJECT = "We let you cook !";
const MorePROJECT = "An another one";
const ToggleText = "Not now !";

const EmptyProjectView = ({
  clients,
  isProjectMoreThan0,
}: ProjectViewProps) => {
  const { value, toggleValue } = useToggle();
  return (
    <>
      {isProjectMoreThan0 ? (
        <>
          <Button onClick={toggleValue} className="">
            {!value
              ? isProjectMoreThan0
                ? MorePROJECT
                : FirstPROJECT
              : ToggleText}
          </Button>
          {isProjectMoreThan0 && value && (
            <ProjectForm
              clients={clients}
              isProjectMoreThan0={isProjectMoreThan0}
              value={value}
              toggleValue={toggleValue}
            />
          )}
        </>
      ) : (
        <ProjectForm
          clients={clients}
          isProjectMoreThan0={isProjectMoreThan0}
          value={value}
          toggleValue={toggleValue}
        />
      )}
    </>
  );
};

export default EmptyProjectView;

type ProjectFormProps = ProjectViewProps & {
  value: boolean;
  toggleValue: () => void;
};

const ProjectForm = ({
  clients,
  isProjectMoreThan0,
  value,
  toggleValue,
}: ProjectFormProps) => {
  return (
    <section className="basis-full h-full mx-auto pb-4 max-w-5xl shrink-0 grow-1">
      <Card className={cn("", !value && "w-fit mx-auto")}>
        <CardHeader className="pr-4 pt-4">
          {value && (
            <IoMdClose
              className="ml-auto cursor-pointer w-5 h-5"
              onClick={toggleValue}
            />
          )}
          <CardTitle className="text-center text-xl uppercase">
            {!value
              ? isProjectMoreThan0
                ? MorePROJECT
                : FirstPROJECT
              : YesPROJECT}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!value ? (
            <Button onClick={toggleValue} className="mx-auto block">
              {!value
                ? isProjectMoreThan0
                  ? MorePROJECT
                  : FirstPROJECT
                : YesPROJECT}{" "}
            </Button>
          ) : (
            <CreateProjectForm clients={clients} />
          )}
        </CardContent>
      </Card>
    </section>
  );
};
