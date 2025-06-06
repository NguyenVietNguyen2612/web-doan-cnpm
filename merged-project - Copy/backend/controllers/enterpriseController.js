const Enterprise = require('../models/enterpriseModel');

// Lấy tất cả doanh nghiệp
exports.getAllEnterprises = async (req, res) => {
  try {
    const enterprises = await Enterprise.getAll();
    res.status(200).json(enterprises);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách doanh nghiệp:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách doanh nghiệp' });
  }
};

// Lấy doanh nghiệp theo ID
exports.getEnterpriseById = async (req, res) => {
  try {
    const enterpriseId = req.params.id;
    const enterprise = await Enterprise.getById(enterpriseId);
    
    if (!enterprise) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp' });
    }
    
    res.status(200).json(enterprise);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin doanh nghiệp:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin doanh nghiệp' });
  }
};

// Tạo doanh nghiệp mới
exports.createEnterprise = async (req, res) => {
  try {
    const { user_id, name, enterprise_type, contact_person, phone } = req.body;

    if (!user_id || !name || !enterprise_type) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const enterpriseData = {
      user_id,
      name,
      enterprise_type,
      contact_person,
      phone
    };

    const enterpriseId = await Enterprise.create(enterpriseData);
    
    res.status(201).json({
      message: 'Tạo doanh nghiệp thành công',
      enterprise_id: enterpriseId
    });
  } catch (error) {
    console.error('Lỗi khi tạo doanh nghiệp:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo doanh nghiệp' });
  }
};

// Cập nhật thông tin doanh nghiệp
exports.updateEnterprise = async (req, res) => {
  try {
    const enterpriseId = req.params.id;
    const { name, enterprise_type, contact_person, phone } = req.body;

    // Kiểm tra xem doanh nghiệp có tồn tại không
    const existingEnterprise = await Enterprise.getById(enterpriseId);
    if (!existingEnterprise) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp' });
    }

    // Cập nhật thông tin doanh nghiệp
    const enterpriseData = {
      name: name || existingEnterprise.name,
      enterprise_type: enterprise_type || existingEnterprise.enterprise_type,
      contact_person: contact_person || existingEnterprise.contact_person,
      phone: phone || existingEnterprise.phone
    };

    const success = await Enterprise.update(enterpriseId, enterpriseData);
    
    if (success) {
      res.status(200).json({ message: 'Cập nhật thông tin doanh nghiệp thành công' });
    } else {
      res.status(400).json({ message: 'Không thể cập nhật thông tin doanh nghiệp' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin doanh nghiệp:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin doanh nghiệp' });
  }
};

// Xóa doanh nghiệp
exports.deleteEnterprise = async (req, res) => {
  try {
    const enterpriseId = req.params.id;

    // Kiểm tra xem doanh nghiệp có tồn tại không
    const existingEnterprise = await Enterprise.getById(enterpriseId);
    if (!existingEnterprise) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp' });
    }

    const success = await Enterprise.delete(enterpriseId);
    
    if (success) {
      res.status(200).json({ message: 'Xóa doanh nghiệp thành công' });
    } else {
      res.status(400).json({ message: 'Không thể xóa doanh nghiệp' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa doanh nghiệp:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa doanh nghiệp' });
  }
};

// Lấy danh sách bài đăng của doanh nghiệp
exports.getEnterprisePosts = async (req, res) => {
  try {
    const enterpriseId = req.params.id;
    
    // Kiểm tra xem doanh nghiệp có tồn tại không
    const existingEnterprise = await Enterprise.getById(enterpriseId);
    if (!existingEnterprise) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp' });
    }
    
    const posts = await Enterprise.getPosts(enterpriseId);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài đăng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách bài đăng' });
  }
};

// Tạo bài đăng mới
exports.createPost = async (req, res) => {
  try {
    const enterpriseId = req.params.id;
    const { title, content, image } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung là bắt buộc' });
    }
    
    // Kiểm tra xem doanh nghiệp có tồn tại không
    const existingEnterprise = await Enterprise.getById(enterpriseId);
    if (!existingEnterprise) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp' });
    }
    
    // Tạo bài đăng mới
    const postData = {
      enterprise_id: enterpriseId,
      title,
      content,
      image
    };
    
    // Giả định có phương thức createPost trong model Enterprise
    const postId = await Enterprise.createPost(postData);
    
    res.status(201).json({
      message: 'Tạo bài đăng thành công',
      post_id: postId
    });
  } catch (error) {
    console.error('Lỗi khi tạo bài đăng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo bài đăng' });
  }
};

// Cập nhật bài đăng
exports.updatePost = async (req, res) => {
  try {
    const enterpriseId = req.params.id;
    const postId = req.params.postId;
    const { title, content, image } = req.body;
    
    // Kiểm tra xem bài đăng có tồn tại không và thuộc về doanh nghiệp không
    // Giả định có phương thức getPostById trong model Enterprise
    const existingPost = await Enterprise.getPostById(enterpriseId, postId);
    if (!existingPost) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }
    
    // Cập nhật bài đăng
    const postData = {
      title: title || existingPost.title,
      content: content || existingPost.content,
      image: image || existingPost.image
    };
    
    // Giả định có phương thức updatePost trong model Enterprise
    const success = await Enterprise.updatePost(enterpriseId, postId, postData);
    
    if (success) {
      res.status(200).json({ message: 'Cập nhật bài đăng thành công' });
    } else {
      res.status(400).json({ message: 'Không thể cập nhật bài đăng' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật bài đăng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật bài đăng' });
  }
};

// Xóa bài đăng
exports.deletePost = async (req, res) => {
  try {
    const enterpriseId = req.params.id;
    const postId = req.params.postId;
    
    // Kiểm tra xem bài đăng có tồn tại không và thuộc về doanh nghiệp không
    // Giả định có phương thức getPostById trong model Enterprise
    const existingPost = await Enterprise.getPostById(enterpriseId, postId);
    if (!existingPost) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }
    
    // Giả định có phương thức deletePost trong model Enterprise
    const success = await Enterprise.deletePost(enterpriseId, postId);
    
    if (success) {
      res.status(200).json({ message: 'Xóa bài đăng thành công' });
    } else {
      res.status(400).json({ message: 'Không thể xóa bài đăng' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa bài đăng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa bài đăng' });
  }
};

// Lấy danh sách đặt chỗ của doanh nghiệp
exports.getEnterpriseBookings = async (req, res) => {
  try {
    const enterpriseId = req.params.id;
    
    // Kiểm tra xem doanh nghiệp có tồn tại không
    const existingEnterprise = await Enterprise.getById(enterpriseId);
    if (!existingEnterprise) {
      return res.status(404).json({ message: 'Không tìm thấy doanh nghiệp' });
    }
    
    const bookings = await Enterprise.getBookings(enterpriseId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đặt chỗ' });
  }
};

// Cập nhật trạng thái đặt chỗ
exports.updateBookingStatus = async (req, res) => {
  try {
    const enterpriseId = req.params.id;
    const bookingId = req.params.bookingId;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Trạng thái là bắt buộc' });
    }
    
    // Kiểm tra xem đặt chỗ có tồn tại không và thuộc về doanh nghiệp không
    // Giả định có phương thức getBookingById trong model Enterprise
    const existingBooking = await Enterprise.getBookingById(enterpriseId, bookingId);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt chỗ' });
    }
    
    // Giả định có phương thức updateBookingStatus trong model Enterprise
    const success = await Enterprise.updateBookingStatus(bookingId, status);
    
    if (success) {
      res.status(200).json({ message: 'Cập nhật trạng thái đặt chỗ thành công' });
    } else {
      res.status(400).json({ message: 'Không thể cập nhật trạng thái đặt chỗ' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái đặt chỗ' });
  }
}; 