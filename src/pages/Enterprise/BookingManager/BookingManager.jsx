import React, { useState, useEffect } from 'react';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholder for fetching enterprise bookings
  useEffect(() => {
    // In a real application, you would fetch bookings from an API
    // For now, we'll use a mock data
    const mockBookings = [
      {
        id: 1,
        groupName: 'Nhóm Học Tập CNPM',
        date: '2023-06-10',
        time: '18:00 - 20:00',
        people: 5,
        status: 'Đã xác nhận'
      },
      {
        id: 2,
        groupName: 'Nhóm Dự Án Web',
        date: '2023-06-12',
        time: '09:00 - 11:00',
        people: 3,
        status: 'Chờ xác nhận'
      },
      {
        id: 3,
        groupName: 'Nhóm Nghiên Cứu AI',
        date: '2023-06-15',
        time: '14:00 - 16:00',
        people: 4,
        status: 'Đã hủy'
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Header area */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">Quản lý đặt chỗ</h1>
        <p className="text-sm text-gray-600">Quản lý lịch đặt chỗ của các nhóm</p>
      </div>
      
      {/* Bookings content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Danh sách đặt chỗ</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Tất cả
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Chờ xác nhận
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Đã xác nhận
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Nhóm</th>
                    <th className="py-3 px-6 text-center">Ngày</th>
                    <th className="py-3 px-6 text-center">Giờ</th>
                    <th className="py-3 px-6 text-center">Số người</th>
                    <th className="py-3 px-6 text-center">Trạng thái</th>
                    <th className="py-3 px-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{booking.groupName}</td>
                      <td className="py-3 px-6 text-center">{booking.date}</td>
                      <td className="py-3 px-6 text-center">{booking.time}</td>
                      <td className="py-3 px-6 text-center">{booking.people}</td>
                      <td className="py-3 px-6 text-center">
                        <span className={`py-1 px-3 rounded-full text-xs ${
                          booking.status === 'Đã xác nhận' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          {booking.status === 'Chờ xác nhận' && (
                            <>
                              <button className="transform hover:text-green-500 hover:scale-110 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button className="transform hover:text-red-500 hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                          {booking.status === 'Đã xác nhận' && (
                            <button className="transform hover:text-blue-500 hover:scale-110">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          )}
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
    </div>
  );
};

export default BookingManager;
