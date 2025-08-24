import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PaymentApiService from "../services/PaymentApiService";
import type {
  PaymentRequest,
  TokenizationFormData,
} from "../types/PaymentTypes";

const PaymentTest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    merchantReference: "",
    amount: 100,
    currency: "AED",
    language: "en",
    customerEmail: "test@example.com",
    customerIp: "",
    tokenName: "",
    customerName: "Test Customer",
    orderDescription: "Test Order",
    paymentOption: "",
    eci: "ECOMMERCE",
    theme: "theme-light",
  });

  console.log(paymentRequest.theme, "dark");

  const [tokenizationFormData, setTokenizationFormData] =
    useState<TokenizationFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentToken, setCurrentToken] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Check if we have an existing order ID from query parameters (for retry scenarios)
    const existingOrderId = searchParams.get("orderId");

    if (existingOrderId) {
      setCurrentOrderId(existingOrderId);
      setPaymentRequest((prev) => ({
        ...prev,
        merchantReference: existingOrderId,
      }));
    } else {
      // Generate new order ID
      const newOrderId = `TEST-${new Date()
        .toISOString()
        .replace(/[-:T]/g, "")
        .slice(0, 14)}`;
      setCurrentOrderId(newOrderId);
      setPaymentRequest((prev) => ({ ...prev, merchantReference: newOrderId }));
    }

    // Setup payment callback listener
    const handlePaymentCallback = (event: MessageEvent) => {
      console.log("Received postMessage:", event.data);

      if (
        event.data &&
        event.data.type === "payment_callback" &&
        event.data.action === "redirect"
      ) {
        // Handle payment completion redirect
        handlePaymentRedirect(
          event.data.redirectUrl,
          event.data.success,
          event.data.merchantReference,
          event.data.responseCode
        );
      }
    };

    window.addEventListener("message", handlePaymentCallback, false);

    return () => {
      window.removeEventListener("message", handlePaymentCallback, false);
    };
  }, [searchParams]);

  useEffect(() => {
    if (showPaymentForm && tokenizationFormData && formRef.current) {
      // Submit the tokenization form after it's rendered
      setTimeout(() => {
        formRef.current?.submit();
      }, 100);
    }
  }, [showPaymentForm, tokenizationFormData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentRequest((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const initiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      const formData = await PaymentApiService.getTokenizationFormData(
        paymentRequest
      );

      if (formData) {
        setTokenizationFormData(formData);
        setShowPaymentForm(true);
        console.log(
          "Tokenization form data received for merchant reference:",
          paymentRequest.merchantReference
        );
      } else {
        setErrorMessage("Failed to get tokenization form data from API");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setErrorMessage(
        `Error initiating payment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentCallback = (
    token: string,
    status: string,
    responseCode: string
  ) => {
    try {
      if (token && status === "14") {
        setCurrentToken(token);
        // Process payment with token if needed
      } else {
        setErrorMessage(
          `Tokenization failed. Status: ${status}, Response Code: ${responseCode}`
        );
        setShowPaymentForm(false);
      }
    } catch (error) {
      console.error("Error handling payment callback:", error);
      setErrorMessage(
        `Error processing payment callback: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setShowPaymentForm(false);
    }
  };

  const handlePaymentRedirect = (
    redirectUrl: string,
    success: boolean,
    merchantReference: string,
    responseCode: string
  ) => {
    try {
      console.log(
        "Payment completed - Success:",
        success,
        "Redirecting to:",
        redirectUrl
      );

      // Navigate to the appropriate page based on payment result
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error handling payment redirect:", error);
      setErrorMessage(
        `Error handling payment redirect: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const cancelPayment = () => {
    setShowPaymentForm(false);
    setErrorMessage("");
    setTokenizationFormData(null);
  };

  const startNewPayment = () => {
    setShowPaymentForm(false);
    setErrorMessage("");
    setTokenizationFormData(null);
    const newOrderId = `TEST-${new Date()
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14)}`;
    setPaymentRequest((prev) => ({ ...prev, merchantReference: newOrderId }));
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3>Amazon Payment Services - Test Integration</h3>
            </div>
            <div className="card-body">
              {!showPaymentForm && (
                <form onSubmit={initiatePayment}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="merchantReference"
                          className="form-label"
                        >
                          Merchant Reference
                        </label>
                        <input
                          type="text"
                          id="merchantReference"
                          name="merchantReference"
                          className="form-control"
                          value={paymentRequest.merchantReference}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="amount" className="form-label">
                          Amount (in AED)
                        </label>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          className="form-control"
                          value={paymentRequest.amount}
                          onChange={handleInputChange}
                          min="1"
                          step="0.01"
                          required
                        />
                        <div className="form-text">Enter the Amount</div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="customerEmail" className="form-label">
                          Customer Email
                        </label>
                        <input
                          type="email"
                          id="customerEmail"
                          name="customerEmail"
                          className="form-control"
                          value={paymentRequest.customerEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="customerName" className="form-label">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          name="customerName"
                          className="form-control"
                          value={paymentRequest.customerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="currency" className="form-label">
                          Currency
                        </label>
                        <select
                          id="currency"
                          name="currency"
                          className="form-control"
                          value={paymentRequest.currency}
                          onChange={handleInputChange}
                        >
                          <option value="AED">AED - UAE Dirham</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="language" className="form-label">
                          Language
                        </label>
                        <select
                          id="language"
                          name="language"
                          className="form-control"
                          value={paymentRequest.language}
                          onChange={handleInputChange}
                        >
                          <option value="en">English</option>
                          <option value="ar">Arabic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="orderDescription"
                          className="form-label"
                        >
                          Order Description
                        </label>
                        <input
                          type="text"
                          id="orderDescription"
                          name="orderDescription"
                          className="form-control"
                          value={paymentRequest.orderDescription}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="theme" className="form-label">
                          Theme
                        </label>
                        <select
                          id="theme"
                          name="theme"
                          className="form-control"
                          value={paymentRequest.theme}
                          onChange={handleInputChange}
                        >
                          <option value="theme-light">Light</option>
                          <option value="theme-dark">Dark</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                      )}
                      Start Payment Process
                    </button>
                  </div>
                </form>
              )}

              {showPaymentForm && tokenizationFormData && (
                <>
                  <div className="alert alert-info">
                    <h5>Step 1: Tokenization</h5>
                    <p>
                      Please enter your card details in the secure form below to
                      generate a payment token.
                    </p>
                  </div>

                  <div
                    className={
                      "payment-iframe-container " + paymentRequest.theme
                    }
                  >
                    <iframe
                      ref={iframeRef}
                      id="paymentFrame"
                      name="paymentFrame"
                      width="100%"
                      height="500"
                      style={{
                        border: "2px solid #007bff",
                        borderRadius: "8px",
                      }}
                      title="Payment Form"
                    />
                  </div>

                  <form
                    ref={formRef}
                    action="/payfort-custom-form.html"
                    method="get"
                    target="paymentFrame"
                    style={{ display: "none" }}
                  >
                    <input
                      type="hidden"
                      name="actionUrl"
                      value={tokenizationFormData.actionUrl}
                    />
                    <input
                      type="hidden"
                      name="service_command"
                      value={tokenizationFormData.serviceCommand}
                    />
                    <input
                      type="hidden"
                      name="access_code"
                      value={tokenizationFormData.accessCode}
                    />
                    <input
                      type="hidden"
                      name="merchant_identifier"
                      value={tokenizationFormData.merchantIdentifier}
                    />
                    <input
                      type="hidden"
                      name="merchant_reference"
                      value={tokenizationFormData.merchantReference}
                    />
                    <input
                      type="hidden"
                      name="language"
                      value={tokenizationFormData.language}
                    />
                    <input
                      type="hidden"
                      name="signature"
                      value={tokenizationFormData.signature}
                    />
                    <input
                      type="hidden"
                      name="return_url"
                      value={tokenizationFormData.returnUrl}
                    />
                    <input
                      type="hidden"
                      name="merchant_extra"
                      value={tokenizationFormData.merchantExtra}
                    />
                  </form>

                  <div className="mt-3">
                    <button
                      className="btn btn-secondary"
                      onClick={cancelPayment}
                    >
                      Cancel Payment
                    </button>
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="alert alert-danger">
                  <h5>Error</h5>
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5>Test Information</h5>
            </div>
            <div className="card-body">
              <h6>Successful Test Cards:</h6>
              <ul className="list-unstyled">
                <li>
                  <strong>Visa:</strong> 4005550000000001
                </li>
                <li>
                  <strong>MasterCard:</strong> 5123450000000008
                </li>
                <li>
                  <strong>AMEX:</strong> 345678000000007
                </li>
              </ul>

              <h6>Declined & Uncertain Test Cards:</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Card Type</th>
                      <th>Number</th>
                      <th>Expiry</th>
                      <th>CVV</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Declined Card</strong>
                      </td>
                      <td>4916783391760242</td>
                      <td>05/30</td>
                      <td>123</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Uncertain Visa</strong>
                      </td>
                      <td>4556437649762022</td>
                      <td>05/30</td>
                      <td>123</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Uncertain MasterCard</strong>
                      </td>
                      <td>5308097663032831</td>
                      <td>05/30</td>
                      <td>123</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h6>General Test Details:</h6>
              <ul className="list-unstyled">
                <li>
                  <strong>CVV:</strong> 123 (456 for AMEX)
                </li>
                <li>
                  <strong>Expiry:</strong> Any future date (or use specific
                  dates above)
                </li>
                <li>
                  <strong>Name:</strong> Any name
                </li>
              </ul>

              <div className="alert alert-info mt-3">
                <small>
                  <strong>Testing Scenarios:</strong>
                  <br />
                  • Use successful cards to test approved transactions
                  <br />• Use declined/uncertain cards to test error handling
                </small>
              </div>

              <div className="alert alert-warning mt-2">
                <small>
                  <strong>Note:</strong> This is a sandbox environment. Use only
                  test card numbers provided above.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
