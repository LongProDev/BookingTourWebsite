import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import statisticsService from '../../../services/statisticsService';
import './statistics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Statistics = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalTours: 0,
    monthlyBookings: [],
    topTours: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [dashboardResponse, revenueResponse] = await Promise.all([
        statisticsService.getDashboardStats(),
        statisticsService.getRevenueStats()
      ]);
      
      setStats({
        ...dashboardResponse.data,
        monthlyBookings: revenueResponse.data.labels.map((label, index) => ({
          _id: index + 1,
          count: revenueResponse.data.values[index]
        })),
        topTours: [] // We'll add this data later when backend supports it
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookingsChartData = {
    labels: months,
    datasets: [{
      label: 'Monthly Bookings',
      data: months.map((_, index) => {
        const monthData = stats.monthlyBookings.find(m => m._id === index + 1);
        return monthData?.count || 0;
      }),
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
    }]
  };

  const revenueChartData = {
    labels: ['Revenue'], // Simplified until we have top tours data
    datasets: [{
      label: 'Total Revenue',
      data: [stats.totalRevenue],
      backgroundColor: '#FFA726',
    }]
  };

  if (loading) return <div>Loading statistics...</div>;

  return (
    <div className="admin-statistics">
      <h2>Dashboard Statistics</h2>
      
      <Row className="stats-cards">
        <Col md={3}>
          <Card>
            <CardBody>
              <h4>Total Bookings</h4>
              <h2>{stats?.totalBookings}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <CardBody>
              <h4>Total Revenue</h4>
              <h2>${stats?.totalRevenue.toFixed(2)}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <CardBody>
              <h4>Total Users</h4>
              <h2>{stats?.totalUsers}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <CardBody>
              <h4>Total Tours</h4>
              <h2>{stats?.totalTours}</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <CardBody>
              <h4>Bookings Over Time</h4>
              <Line data={bookingsChartData} />
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <h4>Top Performing Tours</h4>
              <Bar data={revenueChartData} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics; 