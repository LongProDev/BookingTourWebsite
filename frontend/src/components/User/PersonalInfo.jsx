import React, { useState, useContext, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';

const PersonalInfo = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?._id) {
      setError('User session not found. Please login again.');
      return;
    }

    try {
      const response = await userService.updateUserInfo(user._id, formData);
      if (response.success) {
        const updatedUser = { ...user, ...response.data };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Profile updated successfully!');
        setError('');
      } else {
        setError(response.message || 'Failed to update profile');
        setSuccess('');
      }
    } catch (error) {
      setError(error.message || 'Something went wrong while updating profile');
      setSuccess('');
    }
  };

  return (
    <div className="personal-info">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Username</Label>
          <Input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </FormGroup>
        <FormGroup>
          <Label>Phone</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </FormGroup>
        <FormGroup>
          <Label>Address</Label>
          <Input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </FormGroup>
        <Button className="auth__btn" type="submit">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default PersonalInfo; 