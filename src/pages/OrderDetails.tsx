import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const [searchParams] = useSearchParams();
  
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [lastFourDigits, setLastFourDigits] = useState('1234');

  useEffect(() => {
    // Get order ID from route parameter or query parameter
    if (orderId) {
      setCurrentOrderId(orderId);
    } else {
      const orderIdFromQuery = searchParams.get('orderId');
      if (orderIdFromQuery) {
        setCurrentOrderId(orderIdFromQuery);
      } else {
        setCurrentOrderId(generateOrderId());
      }
    }
    
    // Get payment details from query parameters if available
    const cardDigits = searchParams.get('cardLast4');
    if (cardDigits) {
      setLastFourDigits(cardDigits);
    }
  }, [orderId, searchParams]);

  const generateOrderId = (): string => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `ORD-${dateStr}-${randomNum}`;
  };

  const getEstimatedDeliveryDate = (): string => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return deliveryDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCurrentDate = (): string => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3><i className="bi bi-check-circle"></i> Order Confirmed</h3>
            </div>
            <div className="card-body">
              <div className="alert alert-success">
                <h5>✓ Payment Successful!</h5>
                <p>Thank you for your purchase. Your order has been confirmed and is being processed.</p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h6>Order Information</h6>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Order ID:</strong></td>
                        <td>{currentOrderId}</td>
                      </tr>
                      <tr>
                        <td><strong>Order Date:</strong></td>
                        <td>{getCurrentDate()}</td>
                      </tr>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td><span className="badge bg-success">Confirmed</span></td>
                      </tr>
                      <tr>
                        <td><strong>Payment Method:</strong></td>
                        <td>Credit Card (****{lastFourDigits})</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <h6>Delivery Information</h6>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Delivery Address:</strong></td>
                        <td>
                          123 Main Street<br/>
                          Dubai, UAE<br/>
                          P.O. Box 12345
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Estimated Delivery:</strong></td>
                        <td>{getEstimatedDeliveryDate()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <hr/>

              <div className="mt-4 text-center">
                <a href="/" className="btn btn-primary">Continue Shopping</a>
                <button className="btn btn-outline-secondary ms-2" onClick={() => window.print()}>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;