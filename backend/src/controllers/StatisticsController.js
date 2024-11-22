import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const StatisticsController = {
    getDashboardStats: async (req, res) => {
        try {
          const [totalBookings, totalRevenue, totalUsers, totalTours] = await Promise.all([
            Booking.countDocuments(),
            Booking.aggregate([
              { $match: { tourStatus: 'Completed' } },
              { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]),
            User.countDocuments(),
            Tour.countDocuments()
          ]);
    
          res.status(200).json({
            success: true,
            data: {
              totalBookings,
              totalRevenue: totalRevenue[0]?.total || 0,
              totalUsers,
              totalTours
            }
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message
          });
        }
      },
    

  getRevenueStats: async (req, res) => {
    try {
      const { period = 'monthly' } = req.query;
      
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
      
      const revenueData = await Booking.aggregate([
        {
          $match: {
            tourStatus: 'Completed',
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      const labels = [];
      const values = [];
      
      revenueData.forEach(data => {
        labels.push(`${data._id.month}/${data._id.year}`);
        values.push(data.revenue);
      });

      res.status(200).json({
        success: true,
        data: { labels, values }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}; 