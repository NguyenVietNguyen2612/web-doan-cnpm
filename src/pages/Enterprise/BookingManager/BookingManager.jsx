import React, { useState, useEffect } from 'react';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed'

  // Fetch bookings data
  useEffect(() => {
    // Mock data - replace with actual API call
    const mockBookings = [
      {
        id: 1,
        groupName: 'Nhóm Học Tập CNPM',
        bookerName: 'Nguyễn Văn A',
        date: '2023-06-10',
        time: '18:00 - 20:00',
        people: 5,
        status: 'Đã xác nhận',
        phone: '0123456789',
        notes: 'Cần bàn ở khu vực yên tĩnh',
        receivedTime: '11:42AM 1/6/2025'
      },
      {
        id: 2,
        groupName: 'Nhóm Dự Án Web',
        bookerName: 'Trần Thị B',
        date: '2023-06-12',
        time: '09:00 - 11:00',
        people: 3,
        status: 'Chờ xác nhận',
        phone: '0987654321',
        notes: '',
        receivedTime: '09:15AM 31/5/2025'
      },
      {
        id: 3,
        groupName: 'Nhóm Nghiên Cứu AI',
        bookerName: 'Lê Văn C',
        date: '2023-06-15',
        time: '14:00 - 16:00',
        people: 4,
        status: 'Đã hủy',
        phone: '0369852147',
        notes: 'Cần bàn gần cửa sổ',
        receivedTime: '15:30PM 28/5/2025'
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  }, []);

  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'Chờ xác nhận';
    if (filter === 'confirmed') return booking.status === 'Đã xác nhận';
    return true;
  });

  // Handle booking confirmation
  const handleConfirmBooking = async (bookingId) => {
    try {
      // In real app, make API call here
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Đã xác nhận' } 
          : booking
      ));
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  // Handle booking rejection
  const handleRejectBooking = async (bookingId) => {
    try {
      // In real app, make API call here
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Đã hủy' } 
          : booking
      ));
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

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
              <button 
                className={`px-3 py-1 rounded-lg transition ${filter === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('all')}
              >
                Tất cả
              </button>
              <button 
                className={`px-3 py-1 rounded-lg transition ${filter === 'pending' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('pending')}
              >
                Chờ xác nhận
              </button>
              <button 
                className={`px-3 py-1 rounded-lg transition ${filter === 'confirmed' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('confirmed')}
              >
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
                    <th className="py-3 px-6 text-left">Người đặt</th>
                    <th className="py-3 px-6 text-center">Thời gian nhận thông tin</th>
                    <th className="py-3 px-6 text-center">Trạng thái</th>
                    <th className="py-3 px-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {filteredBookings.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onDoubleClick={() => handleBookingClick(booking)}
                    >
                      <td className="py-3 px-6 text-left">{booking.bookerName}</td>
                      <td className="py-3 px-6 text-center">{booking.receivedTime}</td>
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
                        {booking.status === 'Chờ xác nhận' && (
                          <div className="flex item-center justify-center space-x-3">
                            <button 
                              onClick={() => handleConfirmBooking(booking.id)}
                              className="transform hover:text-green-500 hover:scale-110"
                              title="Xác nhận"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleRejectBooking(booking.id)}
                              className="transform hover:text-red-500 hover:scale-110"
                              title="Từ chối"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {/* Close button */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal header */}
            <h2 className="text-xl font-bold mb-4 text-center">Chi tiết đặt chỗ</h2>

            {/* Detail table */}
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Người đặt</td>
                  <td className="py-2">{selectedBooking.bookerName}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Số lượng người tham gia</td>
                  <td className="py-2">{selectedBooking.people}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Thời gian đặt</td>
                  <td className="py-2">{selectedBooking.date}, {selectedBooking.time}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Số điện thoại</td>
                  <td className="py-2">{selectedBooking.phone}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Ghi chú</td>
                  <td className="py-2">{selectedBooking.notes || "Không có"}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Thời gian nhận thông tin</td>
                  <td className="py-2">{selectedBooking.receivedTime}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Trở về
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;
