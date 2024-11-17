import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import tourService from '../../../services/tourService';
import imageService from '../../../services/imageService';

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    time: '',
    location: '',
    maxPeople: '',
    startDate: '',
    endDate: '',
    startLocation: '',
    featured: false
  });

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
      console.error('Error fetching tours:', error);
      if (error.message.includes('authentication')) {
        window.location.href = '/login';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.image) {
        alert('Image is required');
        return;
      }

      const tourData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxPeople: parseInt(formData.maxPeople),
        price: parseFloat(formData.price)
      };

      if (currentTour) {
        const response = await tourService.updateTour(currentTour._id, tourData);
        if (response.success) {
          setModal(false);
          fetchTours();
        }
      } else {
        const response = await tourService.createTour(tourData);
        if (response.success) {
          setModal(false);
          fetchTours();
        }
      }
    } catch (error) {
      console.error('Error saving tour:', error);
      if (error.message.includes('authentication')) {
        alert('Please log in again to continue');
        window.location.href = '/login';
      } else {
        alert('Error saving tour: ' + error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await tourService.deleteTour(id);
        fetchTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await imageService.uploadImage(file);
        if (imageUrl) {
          setFormData({ ...formData, image: imageUrl });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Tours Management</h2>
      <Button color="primary" onClick={() => {
        setCurrentTour(null);
        setFormData({
          name: '',
          description: '',
          price: 0,
          image: '',
          time: '',
          location: '',
          maxPeople: 0,
          startDate: '',
          endDate: '',
          startLocation: '',
          featured: false
        });
        setModal(true);
      }}>Add New Tour</Button>

      <Table responsive>
        <thead>
          <tr>
            
            <th>Name</th>
            <th>Location</th>
            <th>Image</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Price</th>
            <th>Max People</th>
            <th>Description</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map(tour => (
            <tr key={tour._id}>
              <td>
                <img 
                  src={tour.image} 
                  alt={tour.name} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                />
              </td>
              <td>{tour.name}</td>
              <td>{tour.location}</td>
              <td>{new Date(tour.startDate).toLocaleDateString()}</td>
              <td>{new Date(tour.endDate).toLocaleDateString()}</td>
              <td>${tour.price}</td>
              <td>{tour.maxPeople}</td>
              <td>{tour.description}</td>
              <td>{tour.featured ? 'Yes' : 'No'}</td>
              <td>
                <Button color="info" size="sm" className="me-2" onClick={() => {
                  setCurrentTour(tour);
                  setFormData(tour);
                  setModal(true);
                }}>Edit</Button>
                <Button color="danger" size="sm" onClick={() => handleDelete(tour._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader>{currentTour ? 'Edit Tour' : 'Add New Tour'}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="image">Tour Image</Label>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required={!currentTour}
              />
              {formData.image && (
                <img 
                  src={formData.image} 
                  alt="Tour preview" 
                  style={{ maxWidth: '200px', marginTop: '10px' }} 
                />
              )}
            </FormGroup>
            
            <FormGroup>
              <Label for="time">Duration</Label>
              <Input
                type="text"
                name="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="location">Location</Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="maxPeople">Max People</Label>
              <Input
                type="number"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={(e) => setFormData({...formData, maxPeople: Number(e.target.value)})}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="startLocation">Start Location</Label>
              <Input
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={(e) => setFormData({...formData, startLocation: e.target.value})}
                required
              />
            </FormGroup>
            
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />{' '}
                Featured Tour
              </Label>
            </FormGroup>

            <Button color="primary" type="submit" className="mt-3">
              {currentTour ? 'Update Tour' : 'Create Tour'}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AdminTours; 