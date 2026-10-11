const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.kinoxii.redberryinternship.ge/api";

interface RequestOptions extends RequestInit {
  params?: Record<
    string,
    string | number | boolean | Array<string | number | boolean>
  >;
}

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { params, headers, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const values = Array.isArray(value) ? value : [value];
        values.forEach((item) => searchParams.append(key, String(item)));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }

    throw {
      status: response.status,
      message: errorData.message || "Something went wrong",
      errors: errorData.errors || null,
    };
  }

  if (response.status === 204) return undefined as T;
  return response.json();
};
