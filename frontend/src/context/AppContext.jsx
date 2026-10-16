
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";

const AppContext = createContext(null);

function mapProject(project) {
  return {
    ...project,
    id: String(project._id ?? project.id),
    client: project.clientName ?? project.client ?? "",
    clientName: project.clientName ?? project.client ?? "",
    createdAt: project.createdAt ?? new Date().toISOString(),
  };
}

function mapEstimation(item) {
  return {
    ...item,
    id: String(item._id ?? item.id),
    projectId: String(item.projectId),
    dimensions: {
      length: item.dimensions?.length ?? 0,
      width: item.dimensions?.width ?? 0,
      depth: item.dimensions?.depth ?? 0,
    },
  };
}

export function AppProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [estimationItems, setEstimationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load projects and their saved estimation items from MongoDB.
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const projectResponse = await api.getProjects();
        const loadedProjects = (projectResponse.data ?? []).map(mapProject);

        const estimationResponses = await Promise.all(
          loadedProjects.map((project) =>
            api.getEstimations(project.id)
          )
        );

        const loadedItems = estimationResponses.flatMap(
          (response) => (response.data ?? []).map(mapEstimation)
        );

        if (!cancelled) {
          setProjects(loadedProjects);
          setEstimationItems(loadedItems);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load CiviQ data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // PROJECTS

  const addProject = useCallback(async (project) => {
    setError("");

    const response = await api.createProject({
      name: project.name,
      clientName: project.clientName ?? project.client ?? "",
      location: project.location ?? "",
      description: project.description ?? "",
      status: project.status ?? "Draft",
    });

    const savedProject = mapProject(response.data);
    setProjects((current) => [...current, savedProject]);

    return savedProject;
  }, []);

  const updateProject = useCallback(async (id, updatedData) => {
    setError("");

    const response = await api.updateProject(id, {
      name: updatedData.name,
      clientName: updatedData.clientName ?? updatedData.client ?? "",
      location: updatedData.location ?? "",
      description: updatedData.description ?? "",
      status: updatedData.status,
    });

    const savedProject = mapProject(response.data);

    setProjects((current) =>
      current.map((project) =>
        project.id === id ? savedProject : project
      )
    );

    return savedProject;
  }, []);

  const deleteProject = useCallback(async (id) => {
    setError("");

    await api.deleteProject(id);

    setProjects((current) =>
      current.filter((project) => project.id !== id)
    );

    setEstimationItems((current) =>
      current.filter((item) => item.projectId !== id)
    );
  }, []);

  // ESTIMATION ITEMS

  const addEstimationItem = useCallback(async (item) => {
    setError("");

    const response = await api.createEstimation(item.projectId, {
      category: item.category,
      description: item.description,
      unit: item.unit,
      dimensions: item.dimensions,
      manualQuantity: item.manualQuantity,
      rate: item.rate,
    });

    const savedItem = mapEstimation(response.data);

    setEstimationItems((current) => [...current, savedItem]);

    return savedItem;
  }, []);

  const deleteEstimationItem = useCallback(async (id) => {
    setError("");

    await api.deleteEstimation(id);

    setEstimationItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }, []);

  const value = {
    projects,
    estimationItems,
    loading,
    error,
    setError,
    addProject,
    updateProject,
    deleteProject,
    addEstimationItem,
    deleteEstimationItem,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
