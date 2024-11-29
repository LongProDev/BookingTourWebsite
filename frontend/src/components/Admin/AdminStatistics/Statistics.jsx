import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import statisticsService from '../../../services/statisticsService';
import './statistics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DetailedStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching statistics...');
        const response = await statisticsService.getAllStats();
        console.log('Statistics response:', response);
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Revenue') {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (this.chart.config._config.data.datasets[0].label === 'Revenue') {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
            }
            return value;
          }
        }
      }
    }
  };

  const createChartData = (data, label, color, type = 'line') => {
    console.log(`Creating chart data for ${label}:`, data);
    return {
      labels: data?.labels || [],
      datasets: [{
        label,
        data: data?.values || [],
        borderColor: type === 'line' ? color : undefined,
        backgroundColor: type === 'line' ? `${color}33` : color,
        borderWidth: type === 'line' ? 2 : 0,
        fill: type === 'line',
        tension: type === 'line' ? 0.4 : undefined,
        pointRadius: type === 'line' ? 4 : undefined,
        pointHoverRadius: type === 'line' ? 6 : undefined,
        pointBackgroundColor: type === 'line' ? color : undefined,
        pointBorderColor: type === 'line' ? '#fff' : undefined,
        pointBorderWidth: type === 'line' ? 2 : undefined,
        barThickness: type === 'bar' ? 'flex' : undefined,
        maxBarThickness: type === 'bar' ? 50 : undefined,
      }]
    };
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="detailed-statistics p-4">
      <h2 className="statistics-title mb-4">Dashboard Statistics</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <CardBody>
              <h4>New User Registrations</h4>
              <div className="chart-container">
                <Line 
                  data={createChartData(stats?.userRegistrations, 'New Users', '#4CAF50')} 
                  options={chartOptions}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <CardBody>
              <h4>Successful Bookings</h4>
              <div className="chart-container">
                <Bar 
                  data={createChartData(stats?.successfulBookings, 'Bookings', '#2196F3', 'bar')} 
                  options={chartOptions}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <CardBody>
              <h4>Monthly Revenue</h4>
              <div className="chart-container">
                <Line 
                  data={createChartData(stats?.monthlyRevenue, 'Revenue', '#F44336')} 
                  options={chartOptions}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <CardBody>
              <h4>New Tours Created</h4>
              <div className="chart-container">
                <Bar 
                  data={createChartData(stats?.newTours, 'New Tours', '#9C27B0', 'bar')} 
                  options={chartOptions}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetailedStatistics; 