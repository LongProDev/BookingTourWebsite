import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      // Only admin can access all users
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new user
  createUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "Customer"
      });

      await user.save();
      
      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { password, ...updateData } = req.body;
      
      // Check if user is admin or updating their own profile
      if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own profile"
        });
      }

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default userController;