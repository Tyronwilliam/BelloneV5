import Entete from "@/app/components/reusable/Entete/Entete";
import dynamic from "next/dynamic";
import GridLayout from "../GridLayout/GridLayout";

// const GridLayout = dynamic(() => import("../GridLayout/GridLayout"));

const SingleProjectPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  //   let projectData = await fetch(`http://localhost:3000/projects/${id}`);
  //   let project = await projectData.json();

  let tasksData = await fetch(`http://localhost:3000/tasks/${id}`);
  let tasks = await tasksData.json();

  console.log(tasks);
  return (
    <Entete>
      <GridLayout data={tasks} />
    </Entete>
  );
};

export default SingleProjectPage;
