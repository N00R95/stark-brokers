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
      console.error('Failed to fetch categories:', error);
      throw error.response?.data || error;
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
      console.log('Updating property:', id, 'with data:', propertyData);
      
      const formData = new FormData();
      
      // Add fields only if they exist (optional fields)
      if (propertyData.title) formData.append('title', propertyData.title.trim());
      if (propertyData.description) formData.append('description', propertyData.description.trim());
      if (propertyData.type) formData.append('type', propertyData.type);
      if (propertyData.price) formData.append('price', propertyData.price);
      if (propertyData.area) formData.append('area', propertyData.area);
      if (propertyData.address) formData.append('address', propertyData.address.trim());
      if (propertyData.number_bedroom !== undefined) {
        formData.append('number_bedroom', propertyData.number_bedroom);
      }
      if (propertyData.number_bathroom !== undefined) {
        formData.append('number_bathroom', propertyData.number_bathroom);
      }

      // Add features if they exist
      if (Array.isArray(propertyData.features) && propertyData.features.length > 0) {
        propertyData.features.forEach(featureId => {
          formData.append('features[]', featureId);
        });
      }

      // Add new images if they exist
      if (Array.isArray(propertyData.image) && propertyData.image.length > 0) {
        propertyData.image.forEach(image => {
          if (image instanceof File) {
            formData.append('image[]', image);
          }
        });
      }

      // Debug log FormData
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0], pair[1]);
      }

      // Use POST method directly without method override
      const response = await axiosInstance.post(`/units/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Update property error:', error.response?.data);
      throw error.response?.data || error;
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
  },

  // Get available properties with filters
  getAvailableProperties: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/units', {
        params: {
          ...filters,
          status: 'available'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch available properties:', error);
      throw error.response?.data || error;
    }
  },

  // Get property details
  getPropertyDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`/units/details/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch property details:', error);
      throw error.response?.data || error;
    }
  },

  // Get property filters (types, features, etc.)
  getPropertyFilters: async () => {
    try {
      const [typesResponse, featuresResponse] = await Promise.all([
        axiosInstance.get('/units/type'),
        axiosInstance.get('/categories')
      ]);
      return {
        types: typesResponse.data,
        features: featuresResponse.data
      };
    } catch (error) {
      console.error('Failed to fetch property filters:', error);
      throw error.response?.data || error;
    }
  }
};

export default propertyAPI; 