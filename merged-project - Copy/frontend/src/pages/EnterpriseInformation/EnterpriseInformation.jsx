import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';
import PostCard from '../../components/cards/PostCard';
import Scrollbar from '../../components/common/Scrollbar';
import  api  from '../../services/api';

const mockEnterprise = {
  id: '1',
  name: 'Cafe Example',
  description: 'Không gian cafe làm việc yên tĩnh, phù hợp cho nhóm bạn và các cuộc họp',
  logo: 'https://via.placeholder.com/150',
  coverImage: 'https://via.placeholder.com/1200x300',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  phone: '0123456789',
  email: 'contact@example.com',
  website: 'https://example.com'
};

const mockPosts = [
  {
    id: '1',
    title: 'Khuyến mãi đặc biệt tháng 6',
    content: 'Giảm 20% cho tất cả các nhóm từ 5 người trở lên',
    image: 'https://via.placeholder.com/800x400',
    author: {
      id: '1',
      name: 'Cafe Example'
    },
    createdAt: new Date(),
    address: '123 Đường ABC, Quận 1, TP.HCM',
    type: 'Khuyến mãi'
  }
];

const EnterpriseInformation = () => {
  const { id } = useParams();
  const [enterprise, setEnterprise] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);  useEffect(() => {
    const fetchEnterpriseData = async () => {
      try {
        setLoading(true);
        // For testing, use mock data
        setTimeout(() => {
          if (id === '1') {
            setEnterprise(mockEnterprise);
            setPosts(mockPosts);
          } else {
            console.error('Enterprise not found');
          }
          setLoading(false);
        }, 1000);

        // Comment out API calls for now
        /*
        const enterpriseResponse = await api.get(`/enterprises/${id}`);
        if (enterpriseResponse.data) {
          setEnterprise(enterpriseResponse.data);
          const postsResponse = await api.get(`/enterprises/${id}/posts`);
          setPosts(postsResponse.data);
        }
        */
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchEnterpriseData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!enterprise) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Không tìm thấy thông tin doanh nghiệp</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enterprise Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            {enterprise.coverImage && (
              <img
                src={enterprise.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row -mt-12 sm:-mt-16 items-center">
              <img
                src={enterprise.logo || '/default-enterprise-logo.png'}
                alt={enterprise.name}
                className="w-24 h-24 rounded-lg border-4 border-white bg-white shadow-lg"
              />
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{enterprise.name}</h1>
                <p className="text-gray-600 mt-1">{enterprise.description}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{enterprise.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaPhone className="mr-2" />
                <span>{enterprise.phone}</span>
              </div>              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-2" />
                <span>{enterprise.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Posts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Bài đăng của doanh nghiệp</h2>
          <Scrollbar className="overflow-y-auto" style={{ maxHeight: '600px' }}>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                Chưa có bài đăng nào từ doanh nghiệp này
              </p>
            )}
          </Scrollbar>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseInformation;