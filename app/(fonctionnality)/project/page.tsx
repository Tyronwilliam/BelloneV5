import Entete from "@/app/components/reusable/Entete/Entete";
import { DataTable } from "../../components/reusable/Table/DataTable";
import { columns } from "./Table/column";
import EmptyProjectView from "./Views/ProjectView";

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
  let projectsData = await fetch("http://localhost:3000/projects");
  let projects = await projectsData.json();

  return (
    <Entete word={"Projects"}>
      {projects?.length > 0 ? (
        <DataTable columns={columns} data={projects} />
      ) : (
        <EmptyProjectView clients={clients} />
      )}
    </Entete>
  );
};

export default ProjectPage;
