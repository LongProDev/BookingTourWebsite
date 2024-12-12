import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import tourService from "../../../services/tourService";
import "./tours.css";
import { isFutureDateTime } from '../../../utils/dateUtils';
import SortBox from "../../../shared/SortBox";
import DescriptionColumn from "./DescriptionColumnLimit";

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${process.env.REACT_APP_API_URL}/images/${imagePath.replace(/^\/images\//, '')}`;
};

const ScheduleModal = ({
  isOpen,
  toggle,
  currentTour,
  scheduleData,
  setScheduleData,
  onSubmit,
  editScheduleId
}) => {
  if (!currentTour) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {editScheduleId ? 'Edit Schedule' : 'Add Schedule'} for {currentTour?.name}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Departure Date</Label>
                <Input
                  type="date"
                  value={scheduleData.departureDate}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      departureDate: e.target.value,
                    })
                  }
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Departure Time</Label>
                <Input
                  type="time"
                  value={scheduleData.departureTime}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      departureTime: e.target.value,
                    })
                  }
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Return Date</Label>
                <Input
                  type="date"
                  value={scheduleData.returnDate}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      returnDate: e.target.value,
                    })
                  }
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Return Time</Label>
                <Input
                  type="time"
                  value={scheduleData.returnTime}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      returnTime: e.target.value,
                    })
                  }
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>Transportation</Label>
            <Input
              type="select"
              value={scheduleData.transportation}
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  transportation: e.target.value,
                })
              }
              required
            >
              <option value="">Select Transportation</option>
              <option value="Airplane">Airplane</option>
              <option value="Train">Train</option>
              <option value="Bus">Bus</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Available Seats</Label>
            <Input
              type="number"
              min="1"
              value={scheduleData.availableSeats}
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  availableSeats: e.target.value,
                })
              }
              required
            />
          </FormGroup>

          <div className="d-flex justify-content-end gap-2">
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {editScheduleId ? 'Update Schedule' : 'Add Schedule'}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const TOURS_PER_PAGE = 8;
  const [sortBy, setSortBy] = useState('newest');
  
  const [modal, setModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "0",
    time: "",
    location: "",
    startLocation: "",
    featured: false,
    schedules: [],
  });

  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    departureDate: "",
    departureTime: "",
    returnDate: "",
    returnTime: "",
    transportation: "",
    availableSeats: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const [editScheduleId, setEditScheduleId] = useState(null);

  const [searchFilters, setSearchFilters] = useState({
    name: '',
    location: '',
    price: ''
  });

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await tourService.getAllTours(page, TOURS_PER_PAGE);
      if (response.success) {
        setTours(response.data);
        // Calculate total pages
        const total = response.totalTours || 0;
        setPageCount(Math.ceil(total / TOURS_PER_PAGE));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [page]); // Refetch when page changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const requiredFields = ['name', 'description', 'price', 'time', 'location', 'startLocation'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      if (!currentTour && imageFiles.length === 0) {
        throw new Error('Please upload at least one image');
      }

      const formDataToSend = new FormData();

      // Append all form data except images
      Object.keys(formData).forEach((key) => {
        if (key === 'schedules') {
          formDataToSend.append(key, JSON.stringify(formData[key] || []));
        } else if (key === 'price') {
          const value = parseFloat(formData[key]) || 0;
          formDataToSend.append(key, value);
        } else if (key === 'featured') {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append each image file with the correct field name
      imageFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const response = currentTour
        ? await tourService.updateTour(currentTour._id, formDataToSend)
        : await tourService.createTour(formDataToSend);

      if (response.success) {
        setModal(false);
        fetchTours();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving tour:", error);
      alert(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "0",
      time: "",
      location: "",
      startLocation: "",
      featured: false,
      schedules: [],
    });
    setCurrentTour(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await tourService.deleteTour(id);
        fetchTours();
      } catch (error) {
        console.error("Error deleting tour:", error);
        alert("Error deleting tour: " + error.message);
      }
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate departure date and time
      const isValidDateTime = isFutureDateTime(
        scheduleData.departureDate,
        scheduleData.departureTime
      );

      if (!isValidDateTime) {
        throw new Error('Departure date and time must be in the future');
      }

      if (!currentTour || !currentTour._id) {
        throw new Error('Invalid tour data. Please try again.');
      }

      // Debug logging
      console.log('Schedule Data:', scheduleData);
      
      // Validate all required fields
      const requiredFields = ['departureDate', 'departureTime', 'returnDate', 'returnTime', 'transportation', 'availableSeats'];
      const missingFields = requiredFields.filter(field => !scheduleData[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing fields:', missingFields);
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate numeric fields with detailed logging
      console.log('Validating numeric fields...');
      console.log('Available seats:', scheduleData.availableSeats, typeof scheduleData.availableSeats);
      console.log('Price:', scheduleData.price, typeof scheduleData.price);

      if (isNaN(scheduleData.availableSeats) || parseInt(scheduleData.availableSeats) < 1) {
        console.error('Invalid available seats:', scheduleData.availableSeats);
        throw new Error('Available seats must be a positive number');
      }

      // Format and validate dates with logging
      console.log('Validating dates...');
      const departureDateTime = new Date(`${scheduleData.departureDate}T${scheduleData.departureTime}`);
      const returnDateTime = new Date(`${scheduleData.returnDate}T${scheduleData.returnTime}`);

      console.log('Departure DateTime:', departureDateTime);
      console.log('Return DateTime:', returnDateTime);

      if (isNaN(departureDateTime.getTime()) || isNaN(returnDateTime.getTime())) {
        console.error('Invalid date format:', { 
          departure: scheduleData.departureDate, 
          departureTime: scheduleData.departureTime,
          return: scheduleData.returnDate,
          returnTime: scheduleData.returnTime 
        });
        throw new Error('Invalid date format');
      }

      if (returnDateTime <= departureDateTime) {
        console.error('Invalid date range:', {
          departure: departureDateTime,
          return: returnDateTime
        });
        throw new Error('Return date/time must be after departure date/time');
      }

      // Log the final schedule object
      const newSchedule = {
        ...scheduleData,
        departureDate: departureDateTime.toISOString(),
        returnDate: returnDateTime.toISOString(),
        transportation: scheduleData.transportation,
        availableSeats: parseInt(scheduleData.availableSeats),
      };
      console.log('New Schedule Object:', newSchedule);

      let updatedSchedules;
      if (editScheduleId) {
        // Update existing schedule
        updatedSchedules = currentTour.schedules.map(schedule => 
          schedule._id === editScheduleId ? { ...newSchedule, _id: editScheduleId } : schedule
        );
      } else {
        // Add new schedule
        updatedSchedules = [...(currentTour.schedules || []), newSchedule];
      }

      const updatedTour = {
        ...currentTour,
        schedules: JSON.stringify(updatedSchedules)
      };
      console.log('Updated Tour Object:', updatedTour);

      const response = await tourService.updateTour(currentTour._id, updatedTour);
      console.log('API Response:', response);

      if (response.success) {
        fetchTours();
        setScheduleModal(false);
        setEditScheduleId(null);
        setScheduleData({
          departureDate: "",
          departureTime: "",
          returnDate: "",
          returnTime: "",
          transportation: "",
          availableSeats: "",
        });
      } else {
        console.error('API Error:', response);
        throw new Error(response.message || 'Failed to update schedule');
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert(error.message || "Failed to update schedule");
    }
  };

  const formatSchedules = (schedules) => {
    if (!schedules || schedules.length === 0) return "No schedules";

    return (
      <div className="schedules-list">
        {schedules.map((schedule, index) => (
          <div key={schedule._id} className="schedule-item">
            <small>
              <strong>Schedule {index + 1}:</strong>
              <br />
              🗓 Departure Date:{" "}
              {new Date(schedule.departureDate).toLocaleDateString()}
              <br />⏰ Departure Time: {schedule.departureTime}
              <br />
              🗓 Return Date:{" "}
              {new Date(schedule.returnDate).toLocaleDateString()}
              <br />⏰ Return Time: {schedule.returnTime}
              <br />
              💺 Available Seats: {schedule.availableSeats}
              <Button
                color="info"
                size="sm"
                className="me-2 mt-2"
                onClick={() => handleEditSchedule(schedule)}
              >
                Edit
              </Button>
              <Button
                color="danger"
                size="sm"
                className="mt-2"
                onClick={() => handleDeleteSchedule(currentTour._id, schedule._id)}
              >
                Delete
              </Button>
            </small>
          </div>
        ))}
      </div>
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  const handleDeleteSchedule = async (tourId, scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const updatedSchedules = currentTour.schedules.filter(
        schedule => schedule._id !== scheduleId
      );

      const updatedTour = {
        ...currentTour,
        schedules: JSON.stringify(updatedSchedules)
      };

      const response = await tourService.updateTour(tourId, updatedTour);
      if (response.success) {
        fetchTours();
        alert('Schedule deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert(error.message || 'Failed to delete schedule');
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditScheduleId(schedule._id);
    setScheduleData({
      departureDate: schedule.departureDate.split('T')[0],
      departureTime: schedule.departureTime,
      returnDate: schedule.returnDate.split('T')[0],
      returnTime: schedule.returnTime,
      transportation: schedule.transportation,
      availableSeats: schedule.availableSeats,
    });
    setScheduleModal(true);
  };

  const getFilteredTours = () => {
    return tours.filter(tour => {
      const nameMatch = tour.name.toLowerCase().includes(searchFilters.name.toLowerCase());
      const locationMatch = tour.location.toLowerCase().includes(searchFilters.location.toLowerCase());
      const priceMatch = !searchFilters.price || tour.price <= parseFloat(searchFilters.price);
      
      return nameMatch && locationMatch && priceMatch;
    });
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0); // Reset to first page when searching
  };

  const searchSection = (
    <div className="search-filters mb-4">
      <Row>
        <Col md={4}>
          <FormGroup>
            <Label for="name">Tour Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Search by name..."
              value={searchFilters.name}
              onChange={handleSearchChange}
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="location">Location</Label>
            <Input
              type="text"
              name="location"
              id="location"
              placeholder="Search by location..."
              value={searchFilters.location}
              onChange={handleSearchChange}
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              type="number"
              name="price"
              id="price"
              placeholder="Enter max price..."
              value={searchFilters.price}
              onChange={handleSearchChange}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
  const handleSort = (value) => {
    setSortBy(value);
    let sortedTours = [...tours];

    switch (value) {
      case 'price-high':
        sortedTours.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        sortedTours.sort((a, b) => a.price - b.price);
        break;
      case 'date-near':
        sortedTours.sort((a, b) => {
          const aDate = a.schedules && a.schedules.length > 0 
            ? new Date(a.schedules[0].departureDate) 
            : new Date(9999, 11, 31);
          const bDate = b.schedules && b.schedules.length > 0 
            ? new Date(b.schedules[0].departureDate) 
            : new Date(9999, 11, 31);
          return aDate - bDate;
        });
        break;
      case 'newest':
        sortedTours.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setTours(sortedTours);
  };

  

  return (
    <div className="admin-tours">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tours Management</h2>
        <Button color="primary" onClick={() => setModal(true)}>
          Add New Tour
        </Button>
  
      </div>

      {searchSection}
      <div className="admin-sortbox">
        <SortBox onSortChange={handleSort} currentSort={sortBy} />
      </div>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-danger">{error}</div>}
      
      {!loading && !error && (
        <>
        
          <Table responsive hover>
            <thead>
              <tr>
                <th>No.</th>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Departure Location</th>
                <th>Itinerary</th>
                <th>Price</th>
                <th>Description</th>
                <th>Featured</th>
                <th>Schedules</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {getFilteredTours().map((tour, index) => (
    <tr key={tour._id}>
      <td>{page * TOURS_PER_PAGE + index + 1}</td>
      <td>
        {tour.image && tour.image.length > 0 ? (
          <img
            src={getImageUrl(tour.image[0])}
            alt={tour.name}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            src="/placeholder.jpg"
            alt="Tour placeholder"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
          />
        )}
      </td>
      <td>{tour.name}</td>
      <td>{tour.location}</td>
      <td>{tour.startLocation}</td>
      <td>{tour.time}</td>
      <td>${tour.price}</td>
      <td>
        <DescriptionColumn description={tour.description} />
      </td>
      <td>{tour.featured ? "Yes" : "No"}</td>
      <td>{formatSchedules(tour.schedules)}</td>
      <td>
        <Button
          color="info"
          size="sm"
          className="me-2"
          onClick={() => {
            setCurrentTour(tour);
            setFormData(tour);
            setModal(true);
          }}
        >
          Edit
        </Button>
        <Button
          color="danger"
          size="sm"
          onClick={() => handleDelete(tour._id)}
        >
          Delete
        </Button>
        <Button
          color="success"
          size="sm"
          className="me-2"
          onClick={() => {
            if (!tour) {
              alert("Error: Tour data is missing");
              return;
            }
            setCurrentTour(tour);
            setEditScheduleId(null);
            setScheduleData({
              departureDate: "",
              departureTime: "",
              returnDate: "",
              returnTime: "",
              transportation: "",
              availableSeats: "",
            });
            setScheduleModal(true);
          }}
        >
          Add Schedule
        </Button>
      </td>
    </tr>
  ))}
</tbody>

          </Table>

          <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
            {[...Array(pageCount).keys()].map((number) => (
              <span
                key={number}
                onClick={() => setPage(number)}
                className={page === number ? "active__page" : ""}
              >
                {number + 1}
              </span>
            ))}
          </div>
        </>
      )}

      <Modal isOpen={modal} toggle={() => setModal(false)} size="lg">
        <ModalHeader toggle={() => setModal(false)}>
          {currentTour ? "Edit Tour" : "Add New Tour"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Tour Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="images">Tour Images</Label>
              <Input
                type="file"
                name="images"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                required={!currentTour}
              />
              <div className="image-previews mt-2">
                {currentTour?.image?.map((img, index) => (
                  <div key={index} className="preview-container">
                    <img
                      src={getImageUrl(img)}
                      alt={`Tour ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
                {imagePreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="preview-container">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        const newFiles = imageFiles.filter(
                          (_, i) => i !== index
                        );
                        const newUrls = imagePreviewUrls.filter(
                          (_, i) => i !== index
                        );
                        setImageFiles(newFiles);
                        setImagePreviewUrls(newUrls);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </FormGroup>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="time">Itinerary</Label>
                  <Input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    placeholder="e.g., 3 days"
                    required
                  />
                </FormGroup>
              </Col>
              
              <Col md={6}>
                <FormGroup>
                  <Label for="location">Destination</Label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label for="startLocation">Departure Location</Label>
              <Input
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={(e) =>
                  setFormData({ ...formData, startLocation: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup check className="mb-3">
              <Label check>
                <Input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                />{" "}
                Featured Tour
              </Label>
            </FormGroup>

            <div className="d-flex justify-content-end gap-2">
              <Button
                type="button"
                color="secondary"
                onClick={() => setModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {currentTour ? "Update Tour" : "Create Tour"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      <ScheduleModal
        isOpen={scheduleModal}
        toggle={() => setScheduleModal(false)}
        currentTour={currentTour}
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
        onSubmit={handleScheduleSubmit}
        editScheduleId={editScheduleId}
      />
    </div>
  );
};

export default AdminTours;
