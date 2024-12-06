import axios from "axios";

const localUrl = "http://localhost:3000";
// Création d'une instance Axios configurée
const api = axios.create({
  // baseURL: "http://localhost:3000", // Remplacez par votre URL de base
  baseURL: localUrl, // Remplacez par votre URL de base
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur lors de la requête API:", error);
    return Promise.reject(error);
  }
);

export default api;
