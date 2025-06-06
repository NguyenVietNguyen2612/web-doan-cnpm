import React, { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '../../components/cards/PostCard';
import { Scrollbar } from '../../components/common';

// Import mock data functions
import { getPosts } from '../../mocks/postMocks';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // Store all posts for filtering
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedType, setSelectedType] = useState(''); // Filter by business type
  const observer = useRef();
  const POSTS_PER_PAGE = 5; // Hiển thị 5 bài đăng mỗi lần tải

  // Get unique business types from posts
  const businessTypes = [...new Set(allPosts.map(post => post.type))];
  
  // Function để tải bài đăng theo trang
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts();
      setAllPosts(fetchedPosts);
      
      // Filter posts by type if a filter is selected
      const filteredPosts = selectedType 
        ? fetchedPosts.filter(post => post.type === selectedType)
        : fetchedPosts;
      
      // Phân trang dữ liệu cho cuộn vô hạn
      const startIndex = 0;
      const endIndex = page * POSTS_PER_PAGE;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      // Khi tải trang mới, thêm posts mới vào danh sách hiện tại
      if (page === 1) {
        setPosts(paginatedPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...paginatedPosts.slice(prevPosts.length)]);
      }
      
      // Kiểm tra nếu đã tải hết bài đăng
      if (endIndex >= filteredPosts.length) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedType]);
  
  // Cải thiện infinite scroll với Intersection Observer API
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('Tải thêm bài đăng...', page);
        setPage(prevPage => prevPage + 1);
      }
    }, {
      root: null,
      rootMargin: '100px', // Tăng lên để kích hoạt sớm hơn khi cuộn
      threshold: 0.1 // Giảm threshold để kích hoạt khi phần tử chỉ hiện 10%
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page]);
    // Handle filter change
  const handleFilterChange = (e) => {
    setSelectedType(e.target.value);
  };
    return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Bảng tin</h1>
          </div>
        </header>

        {/* Main Feed Area - Using Custom Scrollbar */}
        <Scrollbar 
          className="flex-1 bg-gray-50" 
          thumbColor="rgba(59, 130, 246, 0.6)" 
          autoHide={false}
          width="8px"
        >
          <div className="p-6">
            {/* Thông báo và bộ lọc */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              {/* Thông báo về bài đăng quảng cáo */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md lg:w-2/3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      Đây là các bài đăng quảng cáo từ doanh nghiệp đối tác. Cuộn xuống để xem thêm.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Bộ lọc loại doanh nghiệp */}
              <div className="mt-4 lg:mt-0">
                <select
                  value={selectedType}
                  onChange={handleFilterChange}
                  className="w-full lg:w-auto pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Tất cả loại doanh nghiệp</option>
                  {businessTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Debug info */}
            <div className="mb-4 bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Debug: Trang hiện tại: {page}, Có thêm bài đăng: {hasMore ? 'Có' : 'Không'}, 
                Đang tải: {loading ? 'Có' : 'Không'}, Số bài đăng: {posts.length}
              </p>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {loading && posts.length === 0 ? (
                // Skeleton loading for initial load
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md mb-6 p-4 animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-64 bg-gray-300 rounded w-full mb-4"></div>
                  </div>
                ))
              ) : (
                // Actual posts
                posts.map((post, index) => {
                  // Nếu là phần tử cuối cùng, thêm ref cho infinite scroll
                  if (index === posts.length - 1) {
                    return (
                      <div key={post.id} ref={lastPostElementRef}>
                        <PostCard post={post} />
                        {hasMore && <p className="text-center text-sm text-gray-500 mt-2">Đang tìm bài đăng tiếp theo...</p>}
                      </div>
                    );
                  } else {
                    return <PostCard key={post.id} post={post} />;
                  }
                })
              )}
              
              {/* Loading indicator for pagination */}
              {loading && posts.length > 0 && (
                <div className="flex justify-center items-center py-6">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2 text-gray-600">Đang tải thêm...</span>
                </div>
              )}
              
              {/* No posts message */}
              {!loading && posts.length === 0 && (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-600">Không có bài đăng nào phù hợp với bộ lọc</p>
                  <button 
                    onClick={() => setSelectedType('')} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Xem tất cả bài đăng
                  </button>
                </div>
              )}
              
              {/* Thông báo khi không còn bài đăng */}
              {!loading && !hasMore && posts.length > 0 && (
                <div className="text-center py-6 text-gray-500">
                  Đã hiển thị tất cả bài đăng
                </div>
              )}
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default FeedPage;