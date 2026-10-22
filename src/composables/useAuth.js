import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { USER_KEY } from "@/lib/user";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const register = async (formData) => {
    try {
      const response = await useApi.post("/register", formData);
      localStorage.setItem("token", response.data.data?.token);
      await queryClient.invalidateQueries({ queryKey: USER_KEY });

      return {
        success: true,
        data: response.data.data || response,
        message: response.data.message || "Register successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response.data || "Failed to register",
      };
    }
  };

  const login = async (formData) => {
    try {
      const response = await useApi.post("/login", formData);
      localStorage.setItem("token", response.data.data?.token);
      await queryClient.invalidateQueries({ queryKey: USER_KEY });

      return {
        success: true,
        data: response.data.data || response,
        message: response.data.message || "Register successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Failed to Login",
      };
    }
  };

  const logout = async () => {
    try {
      const response = await useApi.post("/logout");
      localStorage.removeItem("token");
      queryClient.setQueryData(USER_KEY, null);

      return {
        success: true,
        message: response.data.message || "Logout successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response.data || "Failed to logout",
      };
    }
  };

  const update = async (values = {}) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const response = await useApi.post("/user", formData);
      await queryClient.invalidateQueries({ queryKey: USER_KEY });

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Profil berhasil diperbarui",
      };
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message: error.response?.data?.message || "Gagal memperbarui profil",
      };
    }
  };

  return { register, login, logout, update };
};
