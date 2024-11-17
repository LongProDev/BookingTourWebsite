import User from "../models/User.js";
import jwt from "jsonwebtoken";

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

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Check password
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Create token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        message: "Successfully logged in",
        token,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
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
  }
};

export default authController; 