"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiClient } from "@/lib/api/client";
import { FilterOptions } from "@/types/config";

interface ConfigContextType {
  options: FilterOptions | null;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType>({
  options: null,
  loading: true,
});

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await apiClient<{ data: FilterOptions }>(
          "/filter-options",
        );
        setOptions(response.data);
      } catch (err) {
        console.error("Failed to load filter options", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return (
    <ConfigContext.Provider value={{ options, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
