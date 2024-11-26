import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import userIcon from "../../assets/images/user.png";
import authService from '../../services/authService';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.success) {
        setSuccess('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <section className="change-password">
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container">
              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Change Password</h2>

                <Form onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Current Password"
                      required
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="New Password"
                      required
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      required
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Button
                    className="auth__btn"
                    type="submit"
                  >
                    Change Password
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ChangePassword; 