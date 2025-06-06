-- Xóa database cũ nếu có (tùy chọn)
-- DROP DATABASE IF EXISTS web_scheduler;
CREATE DATABASE IF NOT EXISTS web_scheduler;
USE web_scheduler;

-- USERS
CREATE TABLE IF NOT EXISTS USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('Admin', 'Leader', 'Member', 'Enterprise') NOT NULL,
    status ENUM('active', 'pending', 'inactive') DEFAULT 'pending',
    google_refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GROUPS
CREATE TABLE IF NOT EXISTS `GROUPS` (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MEMBERSHIPS
CREATE TABLE IF NOT EXISTS MEMBERSHIPS (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    role_in_group ENUM('Leader', 'Member') NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `GROUPS`(group_id) ON DELETE CASCADE
);

-- ENTERPRISES
CREATE TABLE IF NOT EXISTS ENTERPRISES (
    enterprise_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    enterprise_type ENUM('cafe', 'restaurant', 'library', 'cinema') NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

-- POSTS
CREATE TABLE IF NOT EXISTS POSTS (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    enterprise_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enterprise_id) REFERENCES ENTERPRISES(enterprise_id) ON DELETE CASCADE
);

-- EVENTS
CREATE TABLE IF NOT EXISTS EVENTS (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    venue VARCHAR(255),
    status ENUM('planned', 'confirmed', 'cancelled') DEFAULT 'planned',
    FOREIGN KEY (group_id) REFERENCES `GROUPS`(group_id) ON DELETE CASCADE
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS BOOKINGS (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    enterprise_id INT NOT NULL,
    booker_id INT NOT NULL,
    number_of_people INT NOT NULL,
    booking_time DATETIME NOT NULL,
    notes TEXT,
    status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE,
    FOREIGN KEY (enterprise_id) REFERENCES ENTERPRISES(enterprise_id) ON DELETE CASCADE,
    FOREIGN KEY (booker_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('draft', 'sent') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE
);

-- LOCATIONS (chỉnh sửa để hỗ trợ group)
CREATE TABLE IF NOT EXISTS LOCATIONS (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT,
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `GROUPS`(group_id) ON DELETE CASCADE,
    INDEX idx_user_group (user_id, group_id)
);

-- TIMESLOTS
CREATE TABLE IF NOT EXISTS TIMESLOTS (
    timeslot_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    google_calendar_event_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `GROUPS`(group_id) ON DELETE CASCADE,
    INDEX idx_user_group (user_id, group_id)
);
--drop table timeslots;

-- PREFERENCES (chỉnh sửa để hỗ trợ group và multiple preferences)
CREATE TABLE IF NOT EXISTS PREFERENCES (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT,
    preferences_json JSON,
    other_preference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `GROUPS`(group_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_group_pref (user_id, group_id)
);




USE web_scheduler;
select * from USERS;

select * from `groups`;

select * from timeslots;

select * from users
join memberships on users.user_id = memberships.user_id
join groups on memberships.group_id = groups.group_id
where groups.group_id = 1;

select * from users
join memberships on users.user_id = memberships.user_id
join `groups` on memberships.group_id = `groups`.group_id
where `groups`.group_id = 12;

select * from timeslots

-- Thêm thành viên vào nhóm "Nhóm Test Web UI" (group_id = 12)
-- test_user1 (id=6) làm Leader
INSERT INTO MEMBERSHIPS (user_id, group_id, role_in_group) VALUES
(7, 12, 'Member'),  -- admin làm thành viên
(8, 12, 'Member'),  -- leader1 làm thành viên  
(9, 12, 'Member'),  -- member1 làm thành viên
(10, 12, 'Member');  -- member1 làm thành viên

select *
from memberships
join users on memberships.user_id = users.user_id
join groups on memberships.group_id = groups.group_id
where groups.group_id = 12;
-- Không thêm enterprise1 (id=4) vì enterprise không phù hợp làm member nhóm

select * from timeslots;

delete from timeslots;

select * from locations;

select * from preferences;