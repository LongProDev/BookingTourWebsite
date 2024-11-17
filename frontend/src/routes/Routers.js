import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import Tours from "../pages/Tours/Tours";
import SearchResultList from "../pages/Tours/SearchResultList";

import AdminLayout from "../pages/Admin/Dashboard.jsx";
import AdminTours from "../components/Admin/AdminTours/Tours.jsx";
import AdminBookings from "../components/Admin/AdminBooking/Bookings.jsx";
import AdminUsers from "../components/Admin/AdminUsers/Users.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="tours" element={<AdminTours />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
};

export default Routers;
