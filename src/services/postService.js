import api from './api';

const BASE_PATH = '/posts';

const postService = {
  // Get all posts with optional pagination
  getAllPosts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`${BASE_PATH}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single post by ID
  getPostById: async (postId) => {
    try {
      const response = await api.get(`${BASE_PATH}/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const response = await api.post(`${BASE_PATH}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing post
  updatePost: async (postId, postData) => {
    try {
      const response = await api.put(`${BASE_PATH}/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`${BASE_PATH}/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like/Unlike a post
  toggleLike: async (postId) => {
    try {
      const response = await api.post(`${BASE_PATH}/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get posts by author ID (e.g., enterprise posts)
  getPostsByAuthor: async (authorId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`${BASE_PATH}/author/${authorId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get approved/pending posts (for admin)
  getPostsByStatus: async (status = 'approved', page = 1, limit = 10) => {
    try {
      const response = await api.get(`${BASE_PATH}/status/${status}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve or reject a post (for admin)
  updatePostStatus: async (postId, status) => {
    try {
      const response = await api.put(`${BASE_PATH}/${postId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default postService;