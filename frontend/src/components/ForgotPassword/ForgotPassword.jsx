import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setMessage('Password reset instructions have been sent to your email.');
      } else {
        setError(response.message || 'Failed to process request');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="forgot-password">
      <Container>
        <Row>
          <Col lg="6" className="m-auto">
            <div className="forgot-password__form">
              <h2>Forgot Password</h2>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <Button
                  className="auth__btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Reset Password'}
                </Button>
              </Form>
              <p>
                Remember your password? <Link to="/login">Login</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ForgotPassword; 