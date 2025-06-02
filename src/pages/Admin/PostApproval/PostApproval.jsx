import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import PostCard from '../../../components/cards/PostCard';
import Scrollbar from '../../../components/common/Scrollbar';

const PostApproval = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef(null);

  // Fetch posts function
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPosts = Array.from({ length: 5 }, (_, i) => ({
        id: posts.length + i + 1,
        title: `Bài đăng mới ${posts.length + i + 1}`,
        content: 'Nội dung bài đăng mới với các thông tin về khuyến mãi, sự kiện...',
        image: `https://picsum.photos/seed/${posts.length + i + 1}/800/400`,
        author: {
          id: `enterprise-${posts.length + i + 1}`,
          name: `Doanh nghiệp ${posts.length + i + 1}`,
          avatar: '/path/to/avatar'
        },
        createdAt: new Date(Date.now() - (posts.length + i) * 24 * 60 * 60 * 1000),
        address: `Địa chỉ ${posts.length + i + 1}, TP.HCM`,
        type: 'Nhà hàng',
        status: 'pending',
        website: 'https://example.com',
        phone: '0123456789'
      }));

      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(page < 5); // Giới hạn 5 trang để demo
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, posts.length]);

  // Handle scroll
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      fetchPosts();
    }
  }, [fetchPosts]);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'approved' } : post
    ));
  };

  const handleReject = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'rejected' } : post
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Duyệt bài đăng</h2>
      </div>

      <Scrollbar
        ref={scrollRef}
        height="calc(100vh - 200px)"
        className="pr-4"
        onScroll={handleScroll}
        autoHide={false}
      >
        <div className="space-y-6">
          {posts.map((post) => (
            <div 
              key={post.id}
              className={`relative transition-colors ${
                post.status === 'approved' ? 'bg-green-50' : 
                post.status === 'rejected' ? 'bg-red-50' : 
                'hover:bg-gray-50'
              }`}
            >
              {/* Action buttons */}
              {post.status === 'pending' && (
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="p-2 bg-white text-green-600 hover:bg-green-100 rounded-full transition-colors shadow-lg"
                    title="Phê duyệt"
                  >
                    <HiCheck className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleReject(post.id)}
                    className="p-2 bg-white text-red-600 hover:bg-red-100 rounded-full transition-colors shadow-lg"
                    title="Từ chối"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Status badge */}
              {post.status !== 'pending' && (
                <div className="absolute top-4 right-4 z-10">
                  {post.status === 'approved' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Đã phê duyệt
                    </span>
                  )}
                  {post.status === 'rejected' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Đã từ chối
                    </span>
                  )}
                </div>
              )}

              <PostCard post={post} />
            </div>
          ))}

          {/* Loading state */}
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          )}

          {/* No more posts */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              Đã hiển thị tất cả bài đăng
            </div>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                Không có bài đăng nào cần duyệt
              </p>
            </div>
          )}
        </div>
      </Scrollbar>
    </div>
  );
};

export default PostApproval;