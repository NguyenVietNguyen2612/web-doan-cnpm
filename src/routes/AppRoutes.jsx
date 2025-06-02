// filepath: e:\web-doan-third\web-doan-cnpm\src\routes\AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Auth/Home';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import AuthLayout from '../layouts/AuthLayout';
import MemberLayout from '../layouts/MemberLayout';
//import AdminLayout from '../layouts/AdminLayout';
import EnterpriseLayout from '../layouts/EnterpriseLayout';
import Dashboard from '../pages/MemberDashboard';
import MemberProfile from '../pages/MemberDashboard/MemberProfile';
import MemberProfileEdit from '../pages/MemberDashboard/MemberProfileEdit';
import MemberTime from '../pages/MemberDashboard/MemberTime';
import GroupList from '../pages/MemberDashboard/GroupList';
import EventManager from '../pages/Group/LeaderArea/EventManager';
import TimeEditor from '../pages/Group/LeaderArea/TimeEditor';
import LocationPreference from '../pages/Group/LeaderArea/LocationPreference';
import GroupCalendar from '../pages/Group/LeaderArea/GroupCalendar';
import SuggestionList from '../pages/Group/LeaderArea/SuggestionList';
import Booking from '../pages/Group/LeaderArea/EventManager/Booking';
// Member area components
import EventViewer from '../pages/Group/MemberArea/EventViewer';
import MemberTimeEditor from '../pages/Group/MemberArea/TimeEditor';
import MemberLocationPreference from '../pages/Group/MemberArea/LocationPreference';
//import AdminDashboard from '../pages/Admin/Dashboard';
import EnterpriseDashboard from '../pages/Enterprise';
import EnterprisePostsManager from '../pages/Enterprise/Posts';
import EnterpriseBookingManager from '../pages/Enterprise/BookingManager';
import EnterpriseProfile from '../pages/Enterprise/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      
      {/* Member routes */}
      <Route element={<MemberLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/calendar" element={<MemberTime />} />
        <Route path="/profile" element={<MemberProfile />} />
        <Route path="/profile/edit" element={<MemberProfileEdit />} />
      </Route>
      
      {/* Group routes */}
      <Route path="/groups/:groupId/event-manager" element={<EventManager />} />
      <Route path="/groups/:groupId/time-editor" element={<TimeEditor />} />
      <Route path="/groups/:groupId/location-preference" element={<LocationPreference />} />
      <Route path="/groups/:groupId/group-calendar" element={<GroupCalendar />} />
      <Route path="/groups/:groupId/suggestion-list" element={<SuggestionList />} />
      <Route path="/groups/:groupId/booking" element={<Booking />} />
      
      {/* Member routes for group functionality */}
      <Route path="/groups/:groupId/member/event-viewer" element={<EventViewer />} />
      <Route path="/groups/:groupId/member/time-editor" element={<MemberTimeEditor />} />
      <Route path="/groups/:groupId/member/location-preference" element={<MemberLocationPreference />} />

      {/* Admin routes 
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>*/}      {/* Enterprise routes */}
      <Route element={<EnterpriseLayout />}>
        <Route path="/enterprise" element={<EnterpriseDashboard />} />
        <Route path="/enterprise/dashboard" element={<EnterpriseDashboard />} />
        <Route path="/enterprise/posts" element={<EnterprisePostsManager />} />
        <Route path="/enterprise/booking" element={<EnterpriseBookingManager />} />
        <Route path="/enterprise/profile" element={<EnterpriseProfile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;