import { apiClient } from "./client";
import { SessionListResponse } from "@/types/sessions";

export interface SessionFilters {
  date: string;
  venues?: string[];
  formats?: string[];
  languages?: string[];
  bands?: string[];
  search?: string;
  sort?: string;
  page?: number;
}

export const sessionsApi = {
  getSessions: async (filters: SessionFilters) =>
    apiClient<SessionListResponse>("/sessions", {
      params: Object.fromEntries(
        Object.entries({
          date: filters.date,
          "venues[]": filters.venues,
          "formats[]": filters.formats,
          "languages[]": filters.languages,
          "bands[]": filters.bands,
          search: filters.search,
          sort: filters.sort,
          page: filters.page,
        }).filter(([, value]) => value !== undefined && value !== ""),
      ) as Record<
        string,
        string | number | boolean | Array<string | number | boolean>
      >,
    }),
};
