import { useApi } from "@/composables/useApi";
import { useAuth } from "@/composables/useAuth";
import { useQuery } from "@tanstack/react-query";

export const USER_KEY = ["user"];

const getToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

export function useUser() {
  const { logout } = useAuth();

  const query = useQuery({
    queryKey: USER_KEY,
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;

      try {
        const response = await useApi.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response);
        return response.data.data || response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 menit dianggap fresh, tidak refetch
    retry: false,
  });

  const handleLogout = async () => {
    const result = await logout();

    if (!result.success) {
      console.log("Gagal logout");
    }
  };

  return {
    user: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    isAuthenticated: !!query.data,
    refreshUser: query.refetch,
    handleLogout,
  };
}
