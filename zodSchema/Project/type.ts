export interface ProjectType {
  id: number;
  title: string;
  description: string;
  clientId: number;
  budget: number;
  startDate: Date; // Utilisation du type Date
  endDate: Date; // Utilisation du type Date
  status: "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";
  progress: number;
  creator: number;
}
