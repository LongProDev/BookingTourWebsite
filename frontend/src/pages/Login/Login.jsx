import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

import loginImg from "../../assets/images/login.png";
import userIcon from "../../assets/images/user.png";
import { AuthContext } from "./../../context/AuthContext";
import  authService  from "../../services/authService";
  
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: 'LOGIN_START' });
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
        
        if (result.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert(result.message);
        dispatch({ type: 'LOGIN_FAILURE', payload: result.message });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      dispatch({ type: 'LOGIN_FAILURE', payload: err.message });
    }
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8" className="m-auto">
              <div className="login__container d-flex justify-content-between">
                <div className="login__img">
                  <img src={loginImg} alt="" />
                </div>
                <div className="login__form">
                  <div className="user">
                    <img src={userIcon} alt="" />
                  </div>
                  <h2>Login</h2>

                  <Form onSubmit={handleClick}>
                    <FormGroup>
                      <input
                        type="text"
                        placeholder="Email"
                        required
                        id="email"
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="password"
                        placeholder="Password"
                        required
                        id="password"
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <Button
                      className="btn secondary__btn auth__btn"
                      type="submit"
                    >
                      Login
                    </Button>
                    <p>
                      Don't have an account? <Link to="/register">Create</Link>
                    </p>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;