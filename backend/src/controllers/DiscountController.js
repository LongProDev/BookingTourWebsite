import Discount from '../models/Discount.js';

const discountController = {
  validateCode: async (req, res) => {
    try {
      const { code } = req.body;
      const discount = await Discount.findOne({ 
        code,
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (!discount) {
        return res.status(404).json({ 
          success: false,
          message: 'Invalid or expired discount code' 
        });
      }

      res.status(200).json({
        success: true,
        data: {
          code: discount.code,
          percentage: discount.percentage
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }
};

export default discountController; 