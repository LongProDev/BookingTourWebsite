import Tour from '../models/Tour.js'; 
import Booking from '../models/Booking.js'; 
import User from '../models/User.js'; 

const StatisticsController = { 
  getAllStats: async (req, res) => { 
    try {
      // Lấy khoảng thời gian cho 12 tháng qua
      const currentDate = new Date(); 
      const startDate = new Date(currentDate); 
      startDate.setMonth(startDate.getMonth() - 11); 
      startDate.setDate(1); 
      startDate.setHours(0, 0, 0, 0); 

      console.log('Date range:', { startDate, currentDate }); 

      // Lấy số lượng người dùng đăng ký hàng tháng
      const userRegistrations = await User.aggregate([ // Sử dụng phương thức aggregate của mô hình User
        {
          $match: { // Lọc các tài liệu theo điều kiện
            createdAt: { 
              $gte: startDate, 
              $lte: currentDate 
            }
          }
        },
        {
          $group: { // Nhóm các tài liệu theo năm và tháng
            _id: { 
              year: { $year: '$createdAt' }, 
              month: { $month: '$createdAt' } 
            },
            count: { $sum: 1 } // Đếm số lượng tài liệu trong mỗi nhóm
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } } // Sắp xếp theo năm và tháng
      ]);

      // Lấy số lượng đặt chỗ thành công hàng tháng
      const successfulBookings = await Booking.aggregate([ // Sử dụng phương thức aggregate của mô hình Booking
        {
          $match: { // Lọc các tài liệu theo điều kiện
            createdAt: { 
              $gte: startDate, 
              $lte: currentDate 
            },
            tourStatus: 'Completed' // Lọc chỉ các đặt chỗ đã hoàn thành
          }
        },
        {
          $group: { // Nhóm các tài liệu theo năm và tháng
            _id: {
              year: { $year: '$createdAt' }, 
              month: { $month: '$createdAt' } 
            },
            count: { $sum: 1 } // Đếm số lượng tài liệu trong mỗi nhóm
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } } // Sắp xếp theo năm và tháng
      ]);

      // Lấy doanh thu hàng tháng
      const monthlyRevenue = await Booking.aggregate([ // Sử dụng phương thức aggregate của mô hình Booking
        {
          $match: { // Lọc các tài liệu theo điều kiện
            createdAt: { 
              $gte: startDate, 
              $lte: currentDate 
            },
            tourStatus: 'Completed' // Lọc chỉ các đặt chỗ đã hoàn thành
          }
        },
        {
          $group: { // Nhóm các tài liệu theo năm và tháng
            _id: {
              year: { $year: '$createdAt' }, 
              month: { $month: '$createdAt' } 
            },
            total: { $sum: '$totalPrice' } // Tính tổng giá của các đặt chỗ đã hoàn thành
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } } // Sắp xếp theo năm và tháng
      ]);

      // Lấy số lượng tour mới được tạo
      const newTours = await Tour.aggregate([ // Sử dụng phương thức aggregate của mô hình Tour
        {
          $match: { // Lọc các tài liệu theo điều kiện
            createdAt: { 
              $gte: startDate, 
              $lte: currentDate 
            }
          }
        },
        {
          $group: { // Nhóm các tài liệu theo năm và tháng
            _id: {
              year: { $year: '$createdAt' }, 
              month: { $month: '$createdAt' } 
            },
            count: { $sum: 1 } // Đếm số lượng tài liệu trong mỗi nhóm
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } } // Sắp xếp theo năm và tháng
      ]);

      // Định dạng dữ liệu để bao gồm tất cả các tháng với giá trị 0 cho các tháng thiếu
      const formatData = (data, valueKey = 'count') => { 
        const months = Array.from({ length: 12 }, (_, i) => { // Tạo mảng cho 12 tháng
          const date = new Date(); 
          date.setUTCMonth(date.getUTCMonth() - (11 - i)); // Lặp qua 12 tháng trước
          date.setUTCDate(1); // Đặt ngày là ngày đầu tiên của tháng
          return {
            year: date.getUTCFullYear(), // Lấy năm
            month: date.getUTCMonth() + 1, // Lấy tháng (thêm 1 vì tháng bắt đầu từ 0)
            value: 0 // Khởi tạo giá trị là 0
          };
        });

        console.log('Raw aggregation data:', data); 

        data.forEach(item => { // Lặp qua từng mục trong dữ liệu
          const index = months.findIndex(m => // Tìm chỉ số của tháng trong mảng months
            m.year === item._id.year && m.month === item._id.month 
          );
          if (index !== -1) { // Nếu tìm thấy tháng
            months[index].value = item[valueKey] || 0; // Cập nhật giá trị nếu dữ liệu tồn tại
          }
        });

        return { // Trả về đối tượng chứa nhãn và giá trị
          labels: months.map(m => `${m.month}/${m.year}`), // Tạo nhãn cho tháng/năm
          values: months.map(m => m.value) // Tạo mảng giá trị
        };
      };

      res.status(200).json({ 
        success: true, 
        data: { 
          userRegistrations: formatData(userRegistrations), 
          successfulBookings: formatData(successfulBookings), 
          monthlyRevenue: formatData(monthlyRevenue, 'total'), 
          newTours: formatData(newTours) 
        }
      });
    } catch (error) { 
      console.error('Statistics error:', error); 
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
};

export default StatisticsController; 