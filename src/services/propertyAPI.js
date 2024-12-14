import axiosInstance from './axiosInstance';

const propertyAPI = {
  // Get all properties
  getProperties: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/properties', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get property details
  getPropertyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create property tour request
  createTourRequest: async (tourData) => {
    try {
      const formData = new FormData();
      Object.keys(tourData).forEach(key => {
        formData.append(key, tourData[key]);
      });

      const response = await axiosInstance.post('/properties/tour-request', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Save property
  saveProperty: async (propertyId) => {
    try {
      const response = await axiosInstance.post(`/properties/${propertyId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Unsave property
  unsaveProperty: async (propertyId) => {
    try {
      const response = await axiosInstance.delete(`/properties/${propertyId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get saved properties
  getSavedProperties: async () => {
    try {
      const response = await axiosInstance.get('/properties/saved');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default propertyAPI; 