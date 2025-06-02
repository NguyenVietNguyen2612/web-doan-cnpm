import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  // Placeholder for fetching enterprise posts
  useEffect(() => {
    // In a real application, you would fetch posts from an API
    // For now, we'll use a mock data
    const mockPosts = [
      {
        id: 1,
        title: 'Quán cafe mới khai trương',
        content: 'Chúng tôi vừa khai trương quán cafe mới tại trung tâm thành phố',
        status: 'Đã đăng',
        createdAt: '2023-06-01'
      },
      {
        id: 2,
        title: 'Khuyến mãi đặc biệt tháng 6',
        content: 'Giảm 20% cho tất cả các món trong thực đơn',
        status: 'Chờ duyệt',
        createdAt: '2023-05-28'
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  // Handle clicking on the delete button to show the confirmation modal
  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (selectedPost) {
      // In a real application, you would call an API to delete the post
      // For now, we'll just filter it out from the state
      const updatedPosts = posts.filter(post => post.id !== selectedPost.id);
      setPosts(updatedPosts);
      // Close the modal after deletion
      setShowDeleteModal(false);
      setSelectedPost(null);
    }
  };

  // Handle cancelling deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPost(null);
  };

  // Handle edit button click
  const handleEditClick = (postId) => {
    navigate(`/enterprise/posts/edit/${postId}`);
  };

  // Handle new post button click
  const handleNewPostClick = () => {
    navigate('/enterprise/posts/new');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Header area */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">Quản lý bài đăng</h1>
        <p className="text-sm text-gray-600">Xem và quản lý các bài đăng của doanh nghiệp</p>
      </div>
      
      {/* Posts content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Danh sách bài đăng</h2>
            <button 
              onClick={handleNewPostClick}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
              Tạo bài đăng mới
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Tiêu đề</th>
                    <th className="py-3 px-6 text-left">Nội dung</th>
                    <th className="py-3 px-6 text-center">Trạng thái</th>
                    <th className="py-3 px-6 text-center">Ngày tạo</th>
                    <th className="py-3 px-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{post.title}</td>
                      <td className="py-3 px-6 text-left truncate max-w-xs">{post.content}</td>
                      <td className="py-3 px-6 text-center">
                        <span className={`py-1 px-3 rounded-full text-xs ${
                          post.status === 'Đã đăng' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">{post.createdAt}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <button 
                            onClick={() => handleEditClick(post.id)}
                            className="transform hover:text-blue-500 hover:scale-110 mr-3"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(post)}
                            className="transform hover:text-red-500 hover:scale-110"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận xóa bài đăng</h3>
            <p className="text-gray-600 mb-4">Bạn có chắc chắn muốn xóa bài đăng "{selectedPost?.title}" không?</p>
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition mr-2"
                onClick={handleConfirmDelete}
              >
                Xóa
              </button>
              <button 
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsManager;
