import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const PaymentRetry: React.FC = () => {
  const { errorCode, orderId } = useParams<{ errorCode?: string; orderId?: string }>();
  const [searchParams] = useSearchParams();
  
  const [currentErrorCode, setCurrentErrorCode] = useState<string>('');
  const [currentOrderId, setCurrentOrderId] = useState<string>('');

  useEffect(() => {
    // Get error code from route parameter or query parameter
    if (errorCode) {
      setCurrentErrorCode(errorCode);
    } else {
      const errorFromQuery = searchParams.get('error');
      if (errorFromQuery) {
        setCurrentErrorCode(errorFromQuery);
      }
    }
    
    // Get order ID - Priority: Route parameter > Query parameter
    if (orderId) {
      setCurrentOrderId(orderId);
    } else {
      const orderIdFromQuery = searchParams.get('orderId');
      if (orderIdFromQuery) {
        setCurrentOrderId(orderIdFromQuery);
      }
    }
  }, [errorCode, orderId, searchParams]);

  const getRetryUrl = (): string => {
    if (currentOrderId) {
      return `/payment-test?orderId=${currentOrderId}`;
    }
    return '/payment-test';
  };

  const getErrorMessage = (): string => {
    switch (currentErrorCode) {
      case '01':
        return 'Insufficient funds. Please check your account balance.';
      case '02':
        return 'Card declined by issuer. Please try a different card.';
      case '03':
        return 'Invalid card details. Please check your card information.';
      case '04':
        return 'Card expired. Please use a valid card.';
      case '05':
        return 'Transaction limit exceeded. Please contact your bank.';
      case '06':
        return 'Network error. Please try again in a few moments.';
      case '07':
        return 'Card blocked. Please contact your bank.';
      case '08':
        return 'Invalid CVV. Please check your card security code.';
      default:
        return 'An unexpected error occurred during payment processing. Please try again or contact support.';
    }
  };

  const getCurrentDateTime = (): string => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h3><i className="bi bi-x-circle"></i> Payment Failed</h3>
            </div>
            <div className="card-body">
              <div className="alert alert-danger">
                <h5>✗ Payment Could Not Be Processed</h5>
                <p>{getErrorMessage()}</p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h6>What happened?</h6>
                  <ul className="list-unstyled">
                    <li>
                      <i className="bi bi-info-circle text-info"></i> 
                      <strong> Error Code:</strong> {currentErrorCode || 'UNKNOWN'}
                    </li>
                    <li>
                      <i className="bi bi-clock text-warning"></i> 
                      <strong> Time:</strong> {getCurrentDateTime()}
                    </li>
                    <li>
                      <i className="bi bi-credit-card text-secondary"></i> 
                      <strong> Payment Method:</strong> Credit Card
                    </li>
                    {currentOrderId && (
                      <li>
                        <i className="bi bi-file-text text-primary"></i> 
                        <strong> Order ID:</strong> {currentOrderId}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Common Solutions</h6>
                  <ul className="small">
                    <li>Check your card details and try again</li>
                    <li>Ensure sufficient funds are available</li>
                    <li>Try a different payment method</li>
                    <li>Contact your bank if the issue persists</li>
                  </ul>
                </div>
              </div>

              <hr/>

              <div className="mt-4 text-center">
                <a href={getRetryUrl()} className="btn btn-primary btn-lg">
                  <i className="bi bi-arrow-clockwise"></i> Try Payment Again
                </a>
                <a href="/" className="btn btn-outline-secondary ms-2">
                  <i className="bi bi-house"></i> Return to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRetry;