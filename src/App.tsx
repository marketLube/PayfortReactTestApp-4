import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PaymentTest from './pages/PaymentTest';
import OrderDetails from './pages/OrderDetails';
import PaymentRetry from './pages/PaymentRetry';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment-test" element={<PaymentTest />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/payment-failed" element={<PaymentRetry />} />
          <Route path="/payment-failed/:errorCode" element={<PaymentRetry />} />
          <Route path="/payment-failed/:errorCode/:orderId" element={<PaymentRetry />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
