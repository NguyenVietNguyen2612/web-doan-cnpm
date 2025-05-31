// filepath: e:\web-doan-third\web-doan-cnpm\src\routes\AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Auth/Home';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import AuthLayout from '../layouts/AuthLayout';
import MemberLayout from '../layouts/MemberLayout';
//import AdminLayout from '../layouts/AdminLayout';
//import EnterpriseLayout from '../layouts/EnterpriseLayout';
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
//import AdminDashboard from '../pages/Admin/Dashboard';
//import EnterpriseDashboard from '../pages/Enterprise';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>      {/* Member routes */}      <Route element={<MemberLayout />}>        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/calendar" element={<MemberTime />} />
        <Route path="/profile" element={<MemberProfile />} />
        <Route path="/profile/edit" element={<MemberProfileEdit />} />      </Route>      {/* Group routes */}      <Route path="/groups/:groupId/event-manager" element={<EventManager />} />
      <Route path="/groups/:groupId/time-editor" element={<TimeEditor />} />
      <Route path="/groups/:groupId/location-preference" element={<LocationPreference />} />
      <Route path="/groups/:groupId/group-calendar" element={<GroupCalendar />} />
      <Route path="/groups/:groupId/suggestion-list" element={<SuggestionList />} />
      <Route path="/groups/:groupId/booking" element={<Booking />} />

      {/* Admin routes 
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>*/}

      {/* Enterprise routes 
      <Route element={<EnterpriseLayout />}>
        <Route path="/enterprise" element={<EnterpriseDashboard />} />
      </Route>*/}
    </Routes>
  );
};

export default AppRoutes;