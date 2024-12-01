import React, { useState, useEffect } from 'react';
import { Table, Input, FormGroup, Label, Row, Col } from 'reactstrap';
import bookingService from '../../../services/bookingService';
import './adminCustomers.css';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await bookingService.getAllBookings();
      if (response.success) {
        // Group bookings by customer info
        const customerMap = new Map();
        
        response.data.forEach(booking => {
          const customerKey = `${booking.customerName}-${booking.customerEmail}-${booking.customerPhone}`;
          
          if (!customerMap.has(customerKey)) {
            customerMap.set(customerKey, {
              customerName: booking.customerName,
              customerEmail: booking.customerEmail,
              customerPhone: booking.customerPhone,
              totalBookings: 0,
              totalSpent: 0,
              lastBooking: null
            });
          }
          
          const customer = customerMap.get(customerKey);
          customer.totalBookings++;
          customer.totalSpent += booking.totalPrice;
          
          // Track most recent booking
          const bookingDate = new Date(booking.bookingDate);
          if (!customer.lastBooking || bookingDate > new Date(customer.lastBooking)) {
            customer.lastBooking = booking.bookingDate;
          }
        });

        setCustomers(Array.from(customerMap.values()));
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getFilteredCustomers = () => {
    return customers.filter(customer => {
      const nameMatch = customer.customerName.toLowerCase().includes(searchFilters.customerName.toLowerCase());
      const emailMatch = customer.customerEmail.toLowerCase().includes(searchFilters.customerEmail.toLowerCase());
      const phoneMatch = customer.customerPhone.includes(searchFilters.customerPhone);

      return nameMatch && emailMatch && phoneMatch;
    });
  };

  const filteredCustomers = getFilteredCustomers();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-customers p-4">
      <h2>Customer Management</h2>

      <div className="search-filters mb-4">
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="customerName">Customer Name</Label>
              <Input
                type="text"
                name="customerName"
                id="customerName"
                placeholder="Search by name..."
                value={searchFilters.customerName}
                onChange={handleSearchChange}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="customerEmail">Email</Label>
              <Input
                type="text"
                name="customerEmail"
                id="customerEmail"
                placeholder="Search by email..."
                value={searchFilters.customerEmail}
                onChange={handleSearchChange}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="customerPhone">Phone</Label>
              <Input
                type="text"
                name="customerPhone"
                id="customerPhone"
                placeholder="Search by phone..."
                value={searchFilters.customerPhone}
                onChange={handleSearchChange}
              />
            </FormGroup>
          </Col>
        </Row>
      </div>

      <Table responsive>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total Bookings</th>
            <th>Total Amount Paid</th>
            <th>Last Booking Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr key={index}>
              <td>{customer.customerName}</td>
              <td>{customer.customerEmail}</td>
              <td>{customer.customerPhone}</td>
              <td>{customer.totalBookings}</td>
              <td>${customer.totalSpent.toFixed(2)}</td>
              <td>{new Date(customer.lastBooking).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminCustomers; 