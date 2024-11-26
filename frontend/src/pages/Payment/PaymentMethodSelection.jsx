import React from 'react';
import { Card, Row, Col } from 'reactstrap';
import { FaCreditCard, FaMobile } from 'react-icons/fa';

const PaymentMethodSelection = ({ onSelect, selectedMethod }) => {
  const paymentMethods = [
    { id: 'Stripe', name: 'Credit Card', icon: <FaCreditCard size={24} /> },
    { id: 'MoMo', name: 'MoMo Wallet', icon: <FaMobile size={24} /> }
  ];

  return (
    <Row>
      {paymentMethods.map(method => (
        <Col md={6} key={method.id}>
          <Card 
            className={`payment-method-card p-3 mb-3 ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => onSelect(method.id)}
          >
            <div className="d-flex align-items-center">
              <div className="me-3">{method.icon}</div>
              <div>
                <h5 className="mb-0">{method.name}</h5>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PaymentMethodSelection; 