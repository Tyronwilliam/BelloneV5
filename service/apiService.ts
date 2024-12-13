import api from "./api";

// Type générique pour les fonctions API, permettant d'accepter n'importe quelle structure de données
type ApiResponse<T> = {
  message: string;
  status: number | null;
} & T;

type ErrorResponse = {
  message: string;
  status: number | null;
};
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Une erreur inconnue s'est produite";
};
// Fonction de gestion d'erreurs pour centraliser le format des erreurs
const handleError = (error: any): ErrorResponse => {
  if (error.response) {
    return {
      message:
        error.response.data.message ||
        "Une erreur est survenue lors de la requête.",
      status: error.response.status,
    };
  } else if (error.request) {
    return {
      message:
        "Pas de réponse du serveur. Veuillez vérifier votre connexion réseau.",
      status: null,
    };
  } else {
    return {
      message: error.message,
      status: null,
    };
  }
};

// Fonction pour récupérer une liste de ressources (GET)
export const fetchAll = async <T>(resource: string): Promise<T[]> => {
  try {
    const response = await api.get<ApiResponse<T[]>>(`/${resource}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Fonction pour récupérer une ressource spécifique (GET)
export const fetchOne = async <T>(
  resource: string,
  id: number | string
): Promise<T> => {
  try {
    const response = await api.get<ApiResponse<T>>(`/${resource}/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Fonction pour créer une nouvelle ressource (POST)
export const create = async <T>(resource: string, data: T): Promise<T> => {
  try {
    const response = await api.post<ApiResponse<T>>(`/${resource}`, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Fonction pour mettre à jour une ressource (PUT)
export const update = async <T>(
  resource: string,
  id: number | string,
  data: Partial<T>
): Promise<T> => {
  try {
    const response = await api.put<ApiResponse<T>>(`/${resource}/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Fonction pour supprimer une ressource (DELETE)
export const remove = async (
  resource: string,
  id: number | string
): Promise<void> => {
  try {
    await api.delete(`/${resource}/${id}`);
  } catch (error) {
    throw handleError(error);
  }
};
