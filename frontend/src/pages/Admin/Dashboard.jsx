import React from 'react';
import { Menu } from 'antd';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import './dashboard.css';
import AdminBookings from '../../components/Admin/AdminBooking/Bookings.jsx';
import AdminTours from '../../components/Admin/AdminTours/Tours.jsx';
import AdminUsers from '../../components/Admin/AdminUsers/Users.jsx';
import AdminReviews from '../../components/Admin/AdminReviews/Reviews.jsx';
import AdminStatistics from '../../components/Admin/AdminStatistics/Statistics.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
  
    if (!user) {
      return; // Wait for auth context to load
    }
  
    if (user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, navigate]);

  // Don't render anything while checking auth state
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h4>Management</h4>
        <Menu 
          mode="inline" 
          defaultSelectedKeys={['5']}
          style={{ height: '100%' }}
        >
          <Menu.Item key="1" onClick={() => navigate('/admin/bookings')}>
            Bookings
          </Menu.Item>
          <Menu.Item key="2" onClick={() => navigate('/admin/tours')}>
            Tours
          </Menu.Item>
          <Menu.Item key="3" onClick={() => navigate('/admin/users')}>
            Users
          </Menu.Item>
          <Menu.Item key="4" onClick={() => navigate('/admin/reviews')}>
            Reviews
          </Menu.Item>
          <Menu.Item key="5" onClick={() => navigate('/admin/statistics')}>
            Statistics
          </Menu.Item>
        </Menu>
      </div>
      <div className="admin-content">
        <Routes>
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="tours" element={<AdminTours />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="" element={<AdminStatistics />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;