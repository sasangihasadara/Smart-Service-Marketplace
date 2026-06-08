import { useEffect, useState } from "react";
import { fetchAdminResource } from "../api/adminApi";

export function useAdminResource(path, fallbackData) {
  const [state, setState] = useState({
    data: fallbackData,
    loading: true,
    error: null,
    source: "loading",
  });

  useEffect(() => {
    let active = true;

    async function loadResource() {
      try {
        const data = await fetchAdminResource(path);

        if (!active) {
          return;
        }

        setState({
          data,
          loading: false,
          error: null,
          source: "api",
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setState({
          data: fallbackData,
          loading: false,
          error: error instanceof Error ? error.message : "Unable to load admin data",
          source: "fallback",
        });
      }
    }

    loadResource();

    return () => {
      active = false;
    };
  }, [fallbackData, path]);

  return state;
}
