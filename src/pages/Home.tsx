import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h1 className="mb-0">Welcome to Amazon Payment Services Test App</h1>
            </div>
            <div className="card-body">
              <p className="lead">
                This is a React-based test application for integrating with Amazon Payment Services (formerly Payfort).
              </p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="bi bi-credit-card text-primary"></i> Payment Testing
                      </h5>
                      <p className="card-text">
                        Test the complete payment flow including tokenization and payment processing.
                      </p>
                      <a href="/payment-test" className="btn btn-primary">
                        Start Payment Test
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="bi bi-info-circle text-info"></i> Test Information
                      </h5>
                      <p className="card-text">
                        View test card numbers and integration details for successful testing.
                      </p>
                      <div className="mt-3">
                        <h6>Quick Test Cards:</h6>
                        <ul className="list-unstyled small">
                          <li><strong>Visa:</strong> 4005550000000001</li>
                          <li><strong>MasterCard:</strong> 5123450000000008</li>
                          <li><strong>AMEX:</strong> 345678000000007</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-info mt-4">
                <h6><i className="bi bi-shield-check"></i> Sandbox Environment</h6>
                <p className="mb-0">
                  This application is configured to work with the Amazon Payment Services sandbox environment. 
                  Use only the provided test card numbers for testing purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;