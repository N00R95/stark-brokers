import axiosInstance from './axiosInstance';

const propertyAPI = {
  // Get all properties/units with filters
  getProperties: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/units', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get property/unit types (apartment, villa, etc.)
  getPropertyTypes: async () => {
    try {
      const response = await axiosInstance.get('/units/type');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get categories with features
  getFeatures: async () => {
    try {
      const response = await axiosInstance.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get property/unit details
  getPropertyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/units/details/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new property/unit
  createProperty: async (propertyData) => {
    try {
      const formData = new FormData();
      
      // Debug log to check data before submission
      console.log('Submitting property data:', propertyData);
      
      // Basic fields
      const requiredFields = [
        'title', 'description', 'type', 'price', 
        'area', 'address', 'number_bedroom', 'number_bathroom'
      ];
      
      requiredFields.forEach(field => {
        if (propertyData[field] !== undefined) {
          formData.append(field, propertyData[field]);
        }
      });

      // Features - ensure it's an array and not empty
      if (Array.isArray(propertyData.features) && propertyData.features.length > 0) {
        propertyData.features.forEach(featureId => {
          formData.append('features[]', featureId);
        });
      }

      // Images - handle both File objects and URLs
      if (Array.isArray(propertyData.image) && propertyData.image.length > 0) {
        propertyData.image.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('image[]', image);
          }
        });
      }

      // Debug log FormData
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axiosInstance.post('/units/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Property API Error:', error.response?.data);
      throw error.response?.data || error;
    }
  },

  // Update existing property/unit
  updateProperty: async (id, propertyData) => {
    try {
      const formData = new FormData();
      
      Object.keys(propertyData).forEach(key => {
        if (key === 'image') {
          propertyData[key].forEach(image => {
            formData.append('image[]', image);
          });
        } else if (key === 'features') {
          propertyData[key].forEach(feature => {
            formData.append('features[]', feature);
          });
        } else {
          formData.append(key, propertyData[key]);
        }
      });

      const response = await axiosInstance.post(`/units/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get owner's properties/units
  getOwnerProperties: async () => {
    try {
      const response = await axiosInstance.get('/units/owner-units');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete property/unit
  deleteProperty: async (id) => {
    try {
      const response = await axiosInstance.get(`/units/delete/${id}`);
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

      const response = await axiosInstance.post('/booking-requests/store', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get tour requests
  getTourRequests: async () => {
    try {
      const response = await axiosInstance.get('/booking-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update tour request status
  updateTourRequest: async (requestId, status) => {
    try {
      const response = await axiosInstance.post('/booking-requests/change-status', {
        booking_id: requestId,
        status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default propertyAPI; 