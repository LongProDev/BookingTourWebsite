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


const ScheduleModal = ({
  isOpen,
  toggle,
  currentTour,
  scheduleData,
  setScheduleData,
  onSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        Add Schedule for {currentTour?.name}
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
            </Input>
          </FormGroup>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Available Seats</Label>
                <Input
                  type="number"
                  value={scheduleData.availableSeats}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      availableSeats: e.target.value,
                    })
                  }
                  min="1"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={scheduleData.price}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      price: e.target.value,
                    })
                  }
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Schedule
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    time: "",
    location: "",
    maxPeople: "",
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
    price: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await tourService.getAllTours();
      if (response.success) {
        setTours(response.data);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      if (error.message.includes("authentication")) {
        window.location.href = "/login";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append tour data
      Object.keys(formData).forEach((key) => {
        if (key !== "image") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append images
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
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
      alert("Error saving tour: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      time: "",
      location: "",
      maxPeople: "",
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
      // Format dates properly
      const departureDateTime = new Date(
        `${scheduleData.departureDate}T${scheduleData.departureTime}`
      );
      const returnDateTime = new Date(
        `${scheduleData.returnDate}T${scheduleData.returnTime}`
      );

      // Validate dates
      if (returnDateTime <= departureDateTime) {
        alert("Return date/time must be after departure date/time");
        return;
      }

      const newSchedule = {
        ...scheduleData,
        departureDate: departureDateTime.toISOString(),
        returnDate: returnDateTime.toISOString(),
        availableSeats: parseInt(scheduleData.availableSeats),
        price: parseFloat(scheduleData.price),
      };

      const updatedTour = {
        ...currentTour,
        schedules: [...(currentTour.schedules || []), newSchedule],
      };

      const response = await tourService.updateTour(
        currentTour._id,
        updatedTour
      );
      if (response.success) {
        fetchTours();
        setScheduleModal(false);
        setScheduleData({
          departureDate: "",
          departureTime: "",
          returnDate: "",
          returnTime: "",
          transportation: "",
          availableSeats: "",
          price: "",
        });
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      alert("Failed to add schedule");
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
              <br />
              💰 Price: ${schedule.price}
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

  return (
    <div className="admin-tours">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tours Management</h2>
        <Button color="primary" onClick={() => setModal(true)}>
          Add New Tour
        </Button>
      </div>

      <Table responsive hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Location</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Price</th>
            <th>Max People</th>
            <th>Description</th>
            <th>Featured</th>
            <th>Schedules</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour._id}>
              <td>
                {tour.image && tour.image.length > 0 ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/images/${tour.image[0]}`}
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
              <td>{tour.time}</td>
              <td>{tour.date.join(", ")}</td>
              <td>${tour.price}</td>
              <td>{tour.maxPeople}</td>
              <td>{tour.description}</td>
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
                    setCurrentTour(tour);
                    setScheduleModal(true);
                  }}
                >
                  Schedules
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="preview-container">
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
              <Col md={6}>
                <FormGroup>
                  <Label for="maxPeople">Max People</Label>
                  <Input
                    type="number"
                    name="maxPeople"
                    value={formData.maxPeople}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPeople: e.target.value })
                    }
                    min="1"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="time">Duration</Label>
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
      />
    </div>
  );
};

export default AdminTours;
