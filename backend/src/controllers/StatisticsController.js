import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

const StatisticsController = {
  getAllStats: async (req, res) => {
    try {
      // Get the date range for the last 12 months
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      console.log('Date range:', { startDate, currentDate });

      // Get monthly user registrations
      const userRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { 
              $gte: startDate,
              $lte: currentDate 
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      
      // Get monthly successful bookings
      const successfulBookings = await Booking.aggregate([
        {
          $match: {
            createdAt: { 
              $gte: startDate,
              $lte: currentDate 
            },
            tourStatus: 'Completed'
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      // Get monthly revenue
      const monthlyRevenue = await Booking.aggregate([
        {
          $match: {
            createdAt: { 
              $gte: startDate,
              $lte: currentDate 
            },
            tourStatus: 'Completed'
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            total: { $sum: '$totalPrice' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      // Get new tours created
      const newTours = await Tour.aggregate([
        {
          $match: {
            createdAt: { 
              $gte: startDate,
              $lte: currentDate 
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Format data to include all months with zero values for missing months
      const formatData = (data, valueKey = 'count') => {
        const months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setUTCMonth(date.getUTCMonth() - (11 - i));
          date.setUTCDate(1);
          return {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            value: 0
          };
        });

        console.log('Raw aggregation data:', data);

        data.forEach(item => {
          const index = months.findIndex(m => 
            m.year === item._id.year && m.month === item._id.month
          );
          if (index !== -1) {
            months[index].value = item[valueKey] || 0;
          }
        });

        return {
          labels: months.map(m => `${m.month}/${m.year}`),
          values: months.map(m => m.value)
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