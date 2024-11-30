import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import Tours from "../pages/Tours/Tours";
import SearchResultList from "../pages/Tours/SearchResultList";
import Booking from "../pages/Booking/Booking";

import AdminLayout from "../pages/Admin/Dashboard.jsx";
import AdminTours from "../components/Admin/AdminTours/Tours.jsx";
import AdminBookings from "../components/Admin/AdminBooking/Bookings.jsx";
import AdminUsers from "../components/Admin/AdminUsers/Users.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import TourDetails from "../pages/TourDetails/TourDetails.jsx";
import AdminStatistics from "../components/Admin/AdminStatistics/Statistics.jsx";
import Account from "../pages/User/Account.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import PaymentConfirmation from '../pages/Payment/PaymentConfirmation';
import PaymentGateway from "../pages/Payment/PaymentGateway.jsx";
import PaymentSuccess from "../pages/Payment/PaymentSuccess.jsx";
import BookingSuccess from "../pages/Booking/BookingSuccess.jsx";
import AdminReviews from "../components/Admin/AdminReviews/Reviews.jsx";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword.jsx";
import BookingHistory from "../components/BookingHistory/BookingHistory.jsx";
import About from "../pages/About/About.jsx";


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<ProtectedRoute noAdmin><Account /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/my-bookings" element={<BookingHistory />} />
      

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="tours" element={<AdminTours />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="statistics" element={<AdminStatistics />} />
      </Route>

      <Route path="/tours/:id/booking" element={<Booking />} />
      <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
      <Route path="/payment-gateway" element={<PaymentGateway />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
    </Routes>
  );
};

export default Routers;
