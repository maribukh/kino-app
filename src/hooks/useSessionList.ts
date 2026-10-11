"use client";

import { useEffect, useState } from "react";
import { SessionFilters, sessionsApi } from "@/lib/api/sessions";
import { SessionListResponse } from "@/types/sessions";

export const useSessionList = (filters: SessionFilters) => {
  const [result, setResult] = useState<SessionListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let isCurrentRequest = true;
    const currentFilters = JSON.parse(filterKey) as SessionFilters;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await sessionsApi.getSessions(currentFilters);
        if (isCurrentRequest) setResult(response);
      } catch (requestError: unknown) {
        if (isCurrentRequest) {
          const message =
            typeof requestError === "object" &&
            requestError !== null &&
            "message" in requestError &&
            typeof requestError.message === "string"
              ? requestError.message
              : "We could not load sessions.";
          setError(
            requestError instanceof Error ? requestError.message : message,
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    };

    load();
    return () => {
      isCurrentRequest = false;
    };
  }, [filterKey]);

  return { result, isLoading, error };
};
