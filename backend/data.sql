USE web_scheduler;
-- USERS
INSERT INTO USERS (username, email, password, full_name, phone, role, status) VALUES
('admin', 'admin@example.com', 'adminpass', 'Admin User', '0123456789', 'Admin', 'active'),
('leader1', 'leader1@example.com', 'leaderpass', 'Leader One', '0987654321', 'Leader', 'active'),
('member1', 'member1@example.com', 'memberpass', 'Member One', '0911222333', 'Member', 'active'),
('enterprise1', 'ent1@example.com', 'entpass', 'Enterprise One', '0909090909', 'Enterprise', 'active');

-- GROUPS
INSERT INTO `GROUPS` (name, description, status) VALUES
('Nhóm A', 'Nhóm học tập A', 'active'),
('Nhóm B', 'Nhóm học tập B', 'active');

-- MEMBERSHIPS
INSERT INTO MEMBERSHIPS (user_id, group_id, role_in_group) VALUES
(2, 1, 'Leader'),
(3, 1, 'Member'),
(2, 2, 'Leader');

-- ENTERPRISES
INSERT INTO ENTERPRISES (user_id, name, enterprise_type, contact_person, phone) VALUES
(4, 'Quán Cafe ABC', 'cafe', 'Nguyễn Văn A', '0909090909'),
(4, 'Nhà hàng XYZ', 'restaurant', 'Trần Thị B', '0911223344');

-- POSTS
INSERT INTO POSTS (enterprise_id, title, content, status) VALUES
(1, 'Khuyến mãi tháng 5', 'Giảm giá 20% cho sinh viên', 'approved'),
(2, 'Món mới ra mắt', 'Thưởng thức món mới tại nhà hàng XYZ', 'pending');

-- EVENTS
INSERT INTO EVENTS (group_id, name, start_time, end_time, venue, status) VALUES
(1, 'Họp nhóm tuần 1', '2025-05-10 09:00:00', '2025-05-10 11:00:00', 'Quán Cafe ABC', 'planned'),
(2, 'Họp nhóm tuần 2', '2025-05-17 14:00:00', '2025-05-17 16:00:00', 'Nhà hàng XYZ', 'confirmed');

-- BOOKINGS
INSERT INTO BOOKINGS (event_id, enterprise_id, booker_id, number_of_people, booking_time, notes, status) VALUES
(1, 1, 2, 5, '2025-05-09 10:00:00', 'Đặt trước cho nhóm A', 'confirmed'),
(2, 2, 2, 7, '2025-05-16 15:00:00', 'Đặt cho nhóm B', 'pending');

-- NOTIFICATIONS
INSERT INTO NOTIFICATIONS (event_id, title, content, status) VALUES
(1, 'Nhắc nhở họp nhóm', 'Đừng quên họp nhóm tuần này!', 'sent'),
(2, 'Thông báo sự kiện', 'Sự kiện tuần sau đã được xác nhận', 'draft');

-- LOCATIONS
INSERT INTO LOCATIONS (user_id, address, latitude, longitude, note) VALUES
(2, '123 Đường A, TP.HCM', 10.762622, 106.660172, 'Địa điểm quen thuộc'),
(3, '456 Đường B, TP.HCM', 10.776889, 106.700806, 'Gần trường học');

-- TIMESLOTS
INSERT INTO TIMESLOTS (user_id, start_time, end_time, google_calendar_event_id) VALUES
(2, '2025-05-10 08:00:00', '2025-05-10 12:00:00', 'gcal_001'),
(3, '2025-05-17 13:00:00', '2025-05-17 17:00:00', 'gcal_002');

-- PREFERENCES
INSERT INTO PREFERENCES (user_id, type) VALUES
(2, 'cafe'),
(3, 'restaurant');
