import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  urlOrMethod: string,
  urlOrOptions?: string | RequestInit,
  data?: any
): Promise<any> {
  let url: string;
  let options: RequestInit;

  // Handle both calling patterns:
  // 1. apiRequest(url, options)
  // 2. apiRequest(method, url, data)
  if (typeof urlOrOptions === 'object') {
    // Pattern 1: apiRequest(url, options)
    url = urlOrMethod;
    options = urlOrOptions;
  } else {
    // Pattern 2: apiRequest(method, url, data)
    const method = urlOrMethod;
    url = urlOrOptions as string;
    options = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
  }

  const res = await fetch(url, options);
  await throwIfResNotOk(res);
  
  // Return null for DELETE requests that return no content
  if (res.status === 204) {
    return null;
  }
  
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
