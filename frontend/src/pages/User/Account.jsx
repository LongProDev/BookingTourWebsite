import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import PersonalInfo from '../../components/User/PersonalInfo';
import ChangePassword from '../../components/User/ChangePassword';
import userIcon from "../../assets/images/user.png";
import './account.css';

const Account = () => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <section className="account-settings">
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container">
              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Account Settings</h2>

                <div className="account-tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal Information
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    Change Password
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'personal' ? (
                    <PersonalInfo />
                  ) : (
                    <ChangePassword />
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Account;