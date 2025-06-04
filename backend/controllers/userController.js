const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  try {
    const { username, email, password, full_name, phone, role } = req.body;

    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await User.getByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Tạo người dùng mới với status 'active' khi tự đăng ký
    const userData = {
      username,
      email,
      password: hashedPassword,
      full_name,
      phone,
      role: role || 'Member',
      status: 'active' // Tự động kích hoạt khi người dùng tự đăng ký
    };

    const userId = await User.create(userData);
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      user_id: userId
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.getByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // Tự động kích hoạt tài khoản nếu đang ở trạng thái 'pending'
    if (user.status === 'pending') {
      await User.update(user.user_id, { 
        ...user, 
        status: 'active' 
      });
      user.status = 'active';
      console.log(`Tài khoản ${username} đã được tự động kích hoạt.`);
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Tài khoản của bạn chưa được kích hoạt' });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        username: user.username,
        role: user.role 
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách người dùng' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Loại bỏ thông tin mật khẩu trước khi trả về
    delete user.password;
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, full_name, phone, role, status } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await User.getById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Cập nhật thông tin người dùng
    const userData = {
      username: username || existingUser.username,
      email: email || existingUser.email,
      full_name: full_name || existingUser.full_name,
      phone: phone || existingUser.phone,
      role: role || existingUser.role,
      status: status || existingUser.status
    };

    const success = await User.update(userId, userData);
    
    if (success) {
      res.status(200).json({ message: 'Cập nhật thông tin người dùng thành công' });
    } else {
      res.status(400).json({ message: 'Không thể cập nhật thông tin người dùng' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await User.getById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const success = await User.delete(userId);
    
    if (success) {
      res.status(200).json({ message: 'Xóa người dùng thành công' });
    } else {
      res.status(400).json({ message: 'Không thể xóa người dùng' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa người dùng' });
  }
};

exports.batchAddUsers = async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
    }
    
    const results = [];
    const errors = [];
    
    // Xử lý từng người dùng
    for (const userData of users) {
      try {
        // Kiểm tra dữ liệu bắt buộc
        if (!userData.username || !userData.email || !userData.password) {
          errors.push({ user: userData.email, error: 'Thiếu thông tin bắt buộc' });
          continue;
        }
        
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const existingUser = await User.getByUsername(userData.username);
        if (existingUser) {
          errors.push({ user: userData.email, error: 'Tên đăng nhập đã tồn tại' });
          continue;
        }
        
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
        
        // Tạo người dùng mới với trạng thái 'pending'
        const newUserData = {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          full_name: userData.full_name || userData.username,
          phone: userData.phone || null,
          role: userData.role || 'Member',
          status: 'pending' // Mặc định là 'pending' khi admin tạo
        };
        
        const userId = await User.create(newUserData);
        results.push({ email: userData.email, user_id: userId });
        
      } catch (error) {
        console.error(`Lỗi khi tạo người dùng ${userData.email}:`, error);
        errors.push({ user: userData.email, error: error.message });
      }
    }
    
    res.status(201).json({
      message: `Đã thêm ${results.length} người dùng, ${errors.length} lỗi`,
      results,
      errors
    });
  } catch (error) {
    console.error('Lỗi khi thêm hàng loạt người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm người dùng' });
  }
}; 