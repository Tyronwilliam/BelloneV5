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
// <Toolbar>
// <MarkButton format="bold" icon={<Bold className="h-4 w-4" />} />
// <MarkButton format="italic" icon={<Italic className="h-4 w-4" />} />
// <MarkButton
//   format="underline"
//   icon={<Underline className="h-4 w-4" />}
// />
// <MarkButton format="code" icon={<Code className="h-4 w-4" />} />
// <BlockButton
//   format="heading-one"
//   icon={<Heading1 className="h-4 w-4" />}
// />
// <BlockButton
//   format="heading-two"
//   icon={<Heading2 className="h-4 w-4" />}
// />
// <BlockButton
//   format="block-quote"
//   icon={<BlocksIcon className="h-4 w-4" />}
// />
// <BlockButton
//   format="numbered-list"
//   icon={<ListOrdered className="h-4 w-4" />}
// />
// <BlockButton
//   format="bulleted-list"
//   icon={<ListBulletIcon className="h-4 w-4" />}
// />
// <BlockButton
//   format="left"
//   icon={<TextAlignLeftIcon className="h-4 w-4" />}
// />
// <BlockButton
//   format="center"
//   icon={<TextAlignCenterIcon className="h-4 w-4" />}
// />
// <BlockButton
//   format="right"
//   icon={<TextAlignRightIcon className="h-4 w-4" />}
// />
// <BlockButton
//   format="justify"
//   icon={<TextAlignJustifyIcon className="h-4 w-4" />}
// />
// </Toolbar>
