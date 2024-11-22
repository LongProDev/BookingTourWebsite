import React from 'react';
import { Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import './dashboard.css';
import AdminBookings from '../../components/Admin/AdminBooking/Bookings.jsx';
import AdminTours from '../../components/Admin/AdminTours/Tours.jsx';
import AdminUsers from '../../components/Admin/AdminUsers/Users.jsx';
import AdminReviews from '../../components/Admin/AdminReviews/Reviews.jsx';
import AdminStatistics from '../../components/Admin/AdminStatistics/Statistics.jsx';

const { TabPane } = Tabs;

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
      <h2>Admin Dashboard</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <AdminBookings />
        </TabPane>
        <TabPane tab="Tours" key="2">
          <AdminTours />
        </TabPane>
        <TabPane tab="Users" key="3">
          <AdminUsers />
        </TabPane>
        <TabPane tab="Reviews" key="4">
          <AdminReviews />
        </TabPane>
        <TabPane tab="Statistics" key="5">
          <AdminStatistics />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;