// filepath: e:\web-doan-third\web-doan-cnpm\src\pages\Auth\Home\Home.jsx
import { Link } from 'react-router-dom';
import HomeBackground from '../../../assets/images/HomeBackground.jpg';
import Logo from '../../../components/common/Logo';
import { RoundButton } from '../../../components/common/Button';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">      {/* Header - Chỉ phần này có màu nền tím nhạt */}      <header className="w-full flex justify-between items-center px-6 py-4 bg-primary-light">
        <div>
          <Link to="/" className="text-black font-bold text-xl px-5">NHÓM 6</Link>
        </div>
        <div className="flex">
          <Link 
            to="/about-us" 
            className="text-black hover:opacity-90 px-6 py-2 font-medium mx-1 bg-white/30"
          >
            VỀ CHÚNG MÌNH
          </Link>          <Link 
            to="/login" 
            className="text-black hover:opacity-90 px-6 py-2 font-medium mx-1 bg-white/30"
          >
            ĐĂNG NHẬP
          </Link>
          <Link 
            to="/signup"            className="text-black hover:opacity-90 px-6 py-2 font-medium mx-1 bg-white/30"
          >
            ĐĂNG KÝ
          </Link>
        </div>
      </header>
      
      {/* Main Content - Ảnh nền với nội dung đè lên */}
      <main 
        className="flex-grow relative"
        style={{
          backgroundImage: `url(${HomeBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Nội dung đặt đè lên ảnh nền */}
        <div className="absolute inset-0 flex flex-col justify-center px-12 py-10 z-10">
          <div className="mb-6">
            <Logo size="default" />
          </div>
          
          <h1 className="text-black text-5xl font-bold mb-10 leading-tight">
            Giải pháp quản lý<br />
            lịch nhóm dễ dàng
          </h1>            <div className="mt-4">
            <Link to="/login">
              <RoundButton variant="primary-light" size="lg">
                TẠO NHÓM NGAY
              </RoundButton>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;