import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentTenant = () => {
  const { tenant_id, username } = useParams(); // Get tenant details from the URL
  const navigate = useNavigate();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [tenants, setTenants] = useState(null); // Store tenant details
  const [selectedTenant, setSelectedTenant] = useState(null); // To store the selected tenant
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [tenantStatus, setTenantStatus] = useState(null); // Track tenant's active status

  useEffect(() => {
    // Fetch tenant active status
    const fetchTenantStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tenant/active', {
          params: { tenantId: tenant_id },
        });

        if (response.data.isActive) {
          setTenantStatus(true); // Tenant is active
          fetchTenantDetails(); // Fetch tenant details if tenant is active
        } else {
          setTenantStatus(false); // Tenant is not active
          setError("Tenant is not active.");
        }
      } catch (err) {
        console.error("Error checking tenant status:", err);
        setError("Error checking tenant status.");
      }
    };
    fetchTenantStatus();
  }, [tenant_id]);

  // Fetch tenant details (like name)
  const fetchTenantDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/tenants/${tenant_id}`);
      if (response.data) {
        setTenants(response.data); // Assuming the API returns tenant details with 'tenant' property
        fetchPaymentDetails(); // Fetch payment details after fetching tenant
      } else {
        setError('Tenant details not found.');
      }
    } catch (err) {
      setError('An error occurred while fetching tenant details.');
      console.error(err);
    }
  };

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/payments/?tenant_id=${tenant_id}`);
      if (response.data) {
        setPaymentDetails(response.data.payment);
      } else {
        setError(response.data.message || 'Failed to fetch payment details.');
      }
    } catch (err) {
      setError('An error occurred while fetching payment details.');
      console.error(err);
    }
  };

  const handleBack = () => navigate(`/tenant/${tenant_id}/${username}`);

  // Handle filter by date
  const handleFilterDate = () => {
    setFilterActive(!filterActive);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  const filteredPayments = paymentDetails.filter((payment) => {
    const paymentDate = new Date(payment.payment_date);
    if (startDate && endDate) {
      return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
    }
    return true; // If no filter, show all payments
  });


  // Display message if tenant is not active
  if (tenantStatus === false) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="navbar">
        <div className="navbar-title">Payment Management</div>
        <div className="navbar-buttons">
          <button onClick={handleFilterDate} className="filter-button">
            {filterActive ? 'Hide Filter' : 'Filter By Date'}
          </button>
        </div>
      </div>

      {/* Date Filter Modal */}
      {filterActive && (
        <div className="filter-container">
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateFilterChange}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateFilterChange}
            />
          </div>
        </div>
      )}

      <div className="payments-container">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <div className="payment-card" key={payment.payment_id}>
              {payment.payment_status === 'paid' && (
                <div className="paid-label">Paid</div>
              )}
              <div className="payment-card-content">
                <h4>{tenants ? tenants.tenant_name : "Unknown Tenant"}</h4>
                <p>Amount: ₱{payment.payment_amount}</p>
                <p>Date: {new Date(payment.payment_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
              </div>
            </div>
          ))
        ) : (
          <div>No payments found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Payment Information</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
            <div>
            <label htmlFor="tenantId">Select Tenant: </label>
            <select
              id="tenantId"
              value={tenant_id}
              onChange={(e) => setTenantId(e.target.value)}
            >
              <option value="">Select Tenant</option>
              {Array.isArray(tenants) && tenants.map((tenant) => (
                <option key={tenant.tenant_id} value={tenant.tenant_id}>
                  {tenant.tenant_name} ({tenant.tenant_id})
                </option>
              ))}
            </select>
          </div>

              <div>
                <label htmlFor="amount">Payment Amount (Peso): </label>
                <input
                  type="number"
                  id="amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="date">Payment Date: </label>
                <input
                  type="date"
                  id="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="proofOfPayment">Proof of Payment (Optional - Image): </label>
                <input
                  type="file"
                  id="proofOfPayment"
                  accept="image/*"
                  onChange={(e) => setProofOfPayment(e.target.files[0])}
                />
              </div>
              <div>
                <button type="button" onClick={handleAddPayment}>
                  Add Payment
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>
      {`
          html, body {
          height: 100%;
          margin: 0;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          color: white;
        }

        .navbar-title {
          font-size: 24px;
        }

        .navbar-buttons button {
          padding: 8px 16px;
          background-color: #4CAF50;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 5px;
          margin-left: 10px;
        }

        .navbar-buttons button:hover {
          background-color: #45a049;
        }

        .filter-button {
          background-color: #f1c40f;
        }

        .filter-container {
          display: flex;
          flex-direction: column;
          padding: 10px;
          background-color: #f7f7f7;
          margin-bottom: 20px;
        }

        .filter-container input {
          margin: 5px 0;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent backdrop */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999; /* Ensure modal is on top of other elements */
          visibility: hidden; /* Modal is hidden by default */
          opacity: 0;
          transition: visibility 0s, opacity 0.3s linear; /* Smooth transition */
        }

        .modal.active {
          visibility: visible;
          opacity: 1; /* Make modal visible when active */
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          z-index: 10000; /* Ensure content inside modal is on top of backdrop */
        }

        .payments-container {
          display: flex;
          flex-wrap: wrap;
          padding: 20px;
          gap: 20px;
          box-sizing: border-box;
        }

        .payment-card {
        background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent white */
        backdrop-filter: blur(10px); /* Apply the blur effect to the background */
        padding: 20px;
        border-radius: 8px;
        flex: 1 1 250px; /* Allow cards to grow and shrink, minimum width of 250px */
        box-sizing: border-box;
        position: relative;
        z-index: 1; /* Ensure payment cards are behind the modal */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Shadow for a soft effect */
        margin: 10px 0;
        transition: all 0.3s ease; /* Optional: Add smooth transition for hover effects */
      }

      .payment-card:hover {
        transform: translateY(-5px); /* Optional: Slight lift effect on hover */
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* Optional: Increased shadow on hover */
      }

        .paid-label {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: green;
          color: white;
          padding: 5px;
          border-radius: 50%;
          transform: rotate(45deg);
          font-size: 12px;
        }

        .payment-card-content h4 {
          font-size: 18px;
          margin-bottom: 10px;
          color: #fff;
        }

        .payment-card-content p {
          font-size: 14px;
          margin: 5px 0;
          color: #fff;
        }

        `}
      </style>
    </div>
  );
};

export default PaymentTenant;
