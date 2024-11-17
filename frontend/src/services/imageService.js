import api from './api';

const imageService = {
  uploadImage: async (formData) => {
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }
};

export default imageService; 