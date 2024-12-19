import Entete from "@/app/components/reusable/Entete/Entete";
import { DataTable } from "../../components/reusable/Table/DataTable";
import { columns } from "./Table/column";
import EmptyProjectView from "./Views/ProjectView";
import { fetchProjectsByCreator } from "@/service/Project/api";
import { formatDateToTimestamp } from "@/utils/date";
import { ProjectType } from "@/zodSchema/Project/project";

const clients = [
  {
    id: "b8a1f799-f8c4-4d2a-9b16-8bcf217f8b11",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    address: {
      street: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75002",
      country: "France",
    },
    notes:
      "Client VIP avec un historique d'achats réguliers. Préférences pour les offres spéciales.",
    createdAt: new Date("2023-01-15T09:45:00Z"),
    updatedAt: new Date("2023-11-10T14:30:00Z"),
  },
];
const ProjectPage = async () => {
  let projects = await fetchProjectsByCreator("675b17f42df59f1ce12a98e0")
    .then((res) => {
      console.log(res)
      // Format the dates in each project
      return res.map((project: ProjectType) => ({
        ...project,
        startDate: formatDateToTimestamp(
          project.startDate as unknown as string
        ),
        endDate: formatDateToTimestamp(project.endDate as unknown as string),
      }));
    })
    .catch((error) => console.error("Error fetching projects:", error));
  console.log(projects, "PROJECTS");
  const isProjectMoreThan0 = projects?.length > 0 ? true : false;
  return (
    <Entete word={"Projects"}>
      {isProjectMoreThan0 ? (
        <>
          {/* Add project even when we have project */}
          <DataTable
            columns={columns}
            data={projects}
            clients={clients}
            isProjectMoreThan0={isProjectMoreThan0}
          />
        </>
      ) : (
        <EmptyProjectView
          clients={clients}
          isProjectMoreThan0={isProjectMoreThan0}
        />
      )}
    </Entete>
  );
};

export default ProjectPage;
