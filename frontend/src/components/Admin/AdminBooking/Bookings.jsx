import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink, Input, FormGroup, Label, Row, Col } from 'reactstrap';
import bookingService from '../../../services/bookingService';
import './bookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    bookingId: null,
    newStatus: null
  });
  const [searchFilters, setSearchFilters] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    tourStatus: ''
  });

  const BOOKINGS_PER_PAGE = 8;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAllBookings();
      const sortedBookings = (response.data || []).sort((a, b) => 
        new Date(b.bookingDate) - new Date(a.bookingDate)
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.message.includes('authentication')) {
        window.location.href = '/login';
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModal(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  const handleStatusUpdateClick = (id, newStatus) => {
    setModal({
      isOpen: true,
      type: 'status',
      bookingId: id,
      newStatus: newStatus
    });
  };

  const handleDeleteClick = (id) => {
    setModal({
      isOpen: true,
      type: 'delete',
      bookingId: id,
      newStatus: null
    });
  };

  const handleConfirm = async () => {
    try {
      if (modal.type === 'status') {
        await bookingService.updateBooking(modal.bookingId, { tourStatus: modal.newStatus });
      } else if (modal.type === 'delete') {
        await bookingService.deleteBooking(modal.bookingId);
      }
      fetchBookings();
      toggleModal();
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to ${modal.type === 'delete' ? 'delete booking' : 'update booking status'}`);
    }
  };

  const getFilteredBookings = () => {
    return bookings.filter(booking => {
      const nameMatch = booking.customerName.toLowerCase().includes(searchFilters.customerName.toLowerCase());
      const emailMatch = booking.customerEmail.toLowerCase().includes(searchFilters.customerEmail.toLowerCase());
      const phoneMatch = booking.customerPhone.includes(searchFilters.customerPhone);
      const statusMatch = !searchFilters.tourStatus || booking.tourStatus === searchFilters.tourStatus;

      return nameMatch && emailMatch && phoneMatch && statusMatch;
    });
  };

  const filteredBookings = getFilteredBookings();
  const indexOfLastBooking = currentPage * BOOKINGS_PER_PAGE;
  const indexOfFirstBooking = indexOfLastBooking - BOOKINGS_PER_PAGE;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const searchSection = (
    <div className="search-filters mb-4">
      <Row>
        <Col md={3}>
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
        <Col md={3}>
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
        <Col md={3}>
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
        <Col md={3}>
          <FormGroup>
            <Label for="tourStatus">Status</Label>
            <Input
              type="select"
              name="tourStatus"
              id="tourStatus"
              value={searchFilters.tourStatus}
              onChange={handleSearchChange}
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-bookings p-4">
      <h2>Bookings Management</h2>
      
      {searchSection}

      <Table responsive>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Tour Name</th>
            <th>Passengers</th>
            <th>Booking Time</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.customerName}</td>
              <td>{booking.customerEmail}</td>
              <td>{booking.customerPhone}</td>
              <td>{booking.tourName}</td>
              <td>
                Adults: {booking.numberOfAdults}<br/>
                Children: {booking.numberOfChildren}
              </td>
              <td>{new Date(booking.bookingDate).toLocaleString()}</td>
              <td>${booking.totalPrice}</td>
              <td>
                <Badge color={
                  booking.tourStatus === 'Paid' ? 'primary' :
                  booking.tourStatus === 'Completed' ? 'success' : 'warning'
                }>
                  {booking.tourStatus}
                </Badge>
              </td>
              <td>
                <div className="booking-actions">
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => handleStatusUpdateClick(booking._id, 'Completed')}
                    disabled={booking.tourStatus === 'Completed'}
                  >
                    Complete
                  </Button>
                  <Button
                    color="warning"
                    size="sm"
                    onClick={() => handleStatusUpdateClick(booking._id, 'Canceled')}
                    disabled={booking.tourStatus === 'Canceled'}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(booking._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index + 1} active={currentPage === index + 1}>
              <PaginationLink onClick={() => paginate(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink next onClick={() => paginate(currentPage + 1)} />
          </PaginationItem>
        </Pagination>
      </div>

      <Modal isOpen={modal.isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Action</ModalHeader>
        <ModalBody>
          {modal.type === 'status' 
            ? `Are you sure you want to mark this booking as ${modal.newStatus?.toLowerCase()}?`
            : 'Are you sure you want to delete this booking?'}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AdminBookings; 