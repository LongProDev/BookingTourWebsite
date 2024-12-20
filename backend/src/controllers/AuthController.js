import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../services/emailService.js";

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists"
        });
      }

      // Create new user
      const newUser = await User.create({
        username,
        email,
        password
      });

      // Create token
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Incorrect email or password"
        });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
      );

      const { password: userPassword, ...userData } = user._doc;

      res.status(200).json({
        success: true,
        message: "Successfully logged in",
        token,
        data: userData
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Verify current password
      const isPasswordCorrect = await user.comparePassword(currentPassword);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found with this email address"
        });
      }

      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1'; // Ensures it meets password requirements

      // Update user's password
      user.password = tempPassword;
      await user.save();

      // Send email with temporary password
      await sendPasswordResetEmail({
        email: user.email,
        username: user.username,
        tempPassword: tempPassword
      });

      res.status(200).json({
        success: true,
        message: "Password reset instructions have been sent to your email"
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to process password reset"
      });
    }
  }
};

export default authController; 