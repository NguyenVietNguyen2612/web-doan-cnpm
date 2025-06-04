import api from './api';

const BASE_PATH = '/enterprises';

const postService = {
  // Get all posts with optional pagination
  getAllPosts: async (page = 1, limit = 10) => {
    try {
      // Lấy danh sách tất cả doanh nghiệp
      const enterprisesResponse = await api.get('/enterprises', {
        params: { page: 1, limit: 100 }
      });
      
      // Lấy bài đăng từ mỗi doanh nghiệp
      const postsPromises = enterprisesResponse.data.map(enterprise => 
        api.get(`${BASE_PATH}/${enterprise.enterprise_id}/posts`)
      );
      
      const postsResponses = await Promise.all(postsPromises);
      
      // Gộp tất cả bài đăng và sắp xếp theo thời gian
      let allPosts = [];
      postsResponses.forEach(response => {
        if (response.data && Array.isArray(response.data)) {
          allPosts = [...allPosts, ...response.data];
        }
      });
      
      // Sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
      allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // Phân trang thủ công
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = allPosts.slice(startIndex, endIndex);
      
      return {
        posts: paginatedPosts,
        totalPosts: allPosts.length,
        currentPage: page,
        totalPages: Math.ceil(allPosts.length / limit),
        hasMore: endIndex < allPosts.length
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get a single post by ID
  getPostById: async (postId) => {
    try {
      // Lấy danh sách tất cả doanh nghiệp
      const enterprisesResponse = await api.get('/enterprises', {
        params: { page: 1, limit: 100 }
      });
      
      // Tìm kiếm bài đăng trong tất cả doanh nghiệp
      for (const enterprise of enterprisesResponse.data) {
        try {
          const postsResponse = await api.get(`${BASE_PATH}/${enterprise.enterprise_id}/posts`);
          if (postsResponse.data && Array.isArray(postsResponse.data)) {
            const post = postsResponse.data.find(p => p.post_id === parseInt(postId, 10));
            if (post) {
              return post;
            }
          }
        } catch (error) {
          // Bỏ qua lỗi và tiếp tục tìm kiếm
          continue;
        }
      }
      
      throw new Error('Post not found');
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Create a new post for an enterprise
  createPost: async (enterpriseId, postData) => {
    try {
      const response = await api.post(`${BASE_PATH}/${enterpriseId}/posts`, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update an existing post
  updatePost: async (enterpriseId, postId, postData) => {
    try {
      const response = await api.put(`${BASE_PATH}/${enterpriseId}/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete a post
  deletePost: async (enterpriseId, postId) => {
    try {
      const response = await api.delete(`${BASE_PATH}/${enterpriseId}/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Get posts by status (for admin)
  getPostsByStatus: async (status = 'approved', page = 1, limit = 10) => {
    try {
      const response = await api.get(`/admin/posts/status/${status}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts by status:', error);
      throw error;
    }
  },

  // Approve or reject a post (for admin)
  updatePostStatus: async (enterpriseId, postId, status) => {
    try {
      const response = await api.put(`/admin/posts/${enterpriseId}/${postId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating post status:', error);
      throw error;
    }
  }
};

export default postService;