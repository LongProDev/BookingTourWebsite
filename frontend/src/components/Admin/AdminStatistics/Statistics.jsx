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
  const [stats, setStats] = useState(null); // Tạo state để lưu dữ liệu thống kê, mặc định là null.
  const [loading, setLoading] = useState(true); // Tạo state để lưu trạng thái đang tải dữ liệu, mặc định là true.

  useEffect(() => {
    // useEffect để gọi API khi component được mount.
    const fetchStats = async () => {
      try {
        console.log('Fetching statistics...'); 
        const response = await statisticsService.getAllStats(); // Gọi API từ dịch vụ thống kê.
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
  }, []); // Mảng dependency rỗng, useEffect chỉ chạy một lần sau khi component được mount.

  // Cấu hình cho các biểu đồ, bao gồm các tùy chỉnh như responsive, plugins, và scales.
  const chartOptions = {
    responsive: true, // Đảm bảo biểu đồ đáp ứng kích thước của container.
    maintainAspectRatio: false, // Không giữ tỷ lệ cố định.
    plugins: {
      legend: {
        position: 'top', 
        labels: {
          font: { size: 12 } 
        }
      },
      tooltip: {
        mode: 'index', // Hiển thị tooltip cho tất cả datasets tại cùng một điểm.
        intersect: false, // Tooltip xuất hiện ngay cả khi chuột không nằm trực tiếp trên điểm.
        callbacks: {
          // Tùy chỉnh định dạng nội dung trong tooltip.
          label: function(context) {
            let label = context.dataset.label || ''; // Lấy nhãn của dataset.
            if (label) {
              label += ': '; // Thêm dấu ":" sau nhãn.
            }
            if (context.dataset.label === 'Revenue') {
              // Định dạng giá trị dạng tiền tệ nếu dataset là Revenue.
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y; // Các giá trị khác giữ nguyên.
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true, // Bắt đầu trục Y từ giá trị 0.
        ticks: {
          callback: function(value) {
            // Tùy chỉnh định dạng hiển thị trên trục Y.
            if (this.chart.config._config.data.datasets[0].label === 'Revenue') {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
            }
            return value; // Các giá trị khác giữ nguyên.
          }
        }
      }
    }
  };

  // Hàm để tạo dữ liệu biểu đồ động cho Line hoặc Bar chart.
  const createChartData = (data, label, color, type = 'line') => {
    console.log(`Creating chart data for ${label}:`, data); 
    return {
      labels: data?.labels || [], // Gắn nhãn cho các trục.
      datasets: [{
        label, 
        data: data?.values || [], 
        borderColor: type === 'line' ? color : undefined, 
        backgroundColor: type === 'line' ? `${color}33` : color, 
        borderWidth: type === 'line' ? 2 : 0, // Độ dày viền.
        fill: type === 'line', // Bật/tắt chế độ tô màu bên dưới đường.
        tension: type === 'line' ? 0.4 : undefined, // Độ cong của đường.
        pointRadius: type === 'line' ? 4 : undefined, // Bán kính điểm trên đường.
        pointHoverRadius: type === 'line' ? 6 : undefined, // Bán kính điểm khi hover.
        pointBackgroundColor: type === 'line' ? color : undefined, // Màu nền của điểm.
        pointBorderColor: type === 'line' ? '#fff' : undefined, // Màu viền của điểm.
        pointBorderWidth: type === 'line' ? 2 : undefined, // Độ dày viền của điểm.
        barThickness: type === 'bar' ? 'flex' : undefined, // Độ dày cột trong Bar chart.
        maxBarThickness: type === 'bar' ? 50 : undefined, // Độ dày tối đa của cột.
      }]
    };
  };


  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="detailed-statistics p-5 ">
      <h2 className="statistics-title mb-4">Dashboard Statistics</h2>
      <Row>
        {/* Biểu đồ số lượng người dùng đăng ký */}
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
        {/* Biểu đồ số lượng booking thành công */}
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
        {/* Biểu đồ doanh thu hàng tháng */}
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
        {/* Biểu đồ số lượng tour mới được tạo */}
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
