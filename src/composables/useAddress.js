import { useApi } from "./useApi";

export const useAddress = () => {
  const getAddress = async (params = {}) => {
    try {
      const response = await useApi.get("/delivery-address", { params });

      return {
        success: true,
        data: response.data?.data || response,
        message:
          response.data?.message || "Retrieve delivery address successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response.data || "Failed to retrive delivery address",
      };
    }
  };

  const createAddress = async (formData) => {
    try {
      const response = await useApi.post("/delivery-address", formData);

      return {
        success: true,
        data: response.data.data || response,
        message: response.data.message || "Create delivery address successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response.data || "Failed to create delivery address",
      };
    }
  };

  const chooseAddress = async (id) => {
    try {
      const response = await useApi.put(`/delivery-address/${id}/choose`);

      return {
        success: true,
        data: response.data?.data || response,
        message:
          response.data?.message || "Delivery address selected successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to select delivery address",
      };
    }
  };

  const deleteAddress = async (id) => {
    try {
      const response = await useApi.delete(`/delivery-address/${id}`);

      return {
        success: true,
        message:
          response.data?.message || "Delete delivery address successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response.data || "Failed to delete delivery address",
      };
    }
  };

  return {
    getAddress,
    createAddress,
    chooseAddress,
    deleteAddress,
  };
};
