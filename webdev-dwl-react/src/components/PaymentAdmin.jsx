import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentAdmin = (props) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [tenants, setTenants] = useState([]);
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [filterActive, setFilterActive] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tenants');
        setTenants(response.data);
        setLoadingTenants(false);
      } catch (error) {
        console.error("Error fetching tenants:", error);
        setLoadingTenants(false);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/payments');
        if (response.data && Array.isArray(response.data.payment)) {
          setPayments(response.data.payment);
        } else {
          setError("Payment details not found.");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchTenants();
    fetchPayments();
  }, []);

  const tenantMap = tenants.reduce((acc, tenant) => {
    acc[tenant.tenant_id] = tenant.tenant_name || tenant.username;
    return acc;
  }, {});

  const filteredPayments = payments.filter((payment) => tenantMap[payment.tenant_id]);

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

  const handleAddPayment = async () => {
    try {
      const formData = new FormData();
      formData.append('tenant_id', tenantId); // Ensure field name matches backend
      formData.append('payment_amount', paymentAmount); // Ensure field name matches backend
      formData.append('payment_date', paymentDate); // Ensure field name matches backend
  
      if (proofOfPayment) {
        formData.append('proof_of_payment', proofOfPayment); // Ensure field name matches backend
      }
  
      const response = await axios.post('http://localhost:5001/api/payments', formData);
      if (response.status === 201) { // 201 indicates successful resource creation
        setPayments((prev) => [...prev, response.data]);
        setIsModalOpen(false);
        setError('');
      } else {
        setError('Failed to add payment.');
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      setError('Failed to add payment.');
    }
  };
  

  return (
    <div>
      <div className="navbar">
        <div className="navbar-title">Payment Management</div>
        <div className="navbar-buttons">
          <button onClick={() => setIsModalOpen(true)}>Add Payment</button>
          <button onClick={handleFilterDate} className="filter-button">
            {filterActive ? 'Hide Filter' : 'Filter By Date'}
          </button>
        </div>
      </div>

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
          filteredPayments.map((payment) => {
            const tenant = tenantMap[payment.tenant_id];
            return (
              <div className="payment-card" key={payment.payment_id}>
                {payment.payment_status === 'paid' && (
                  <div className="paid-label">Paid</div>
                )}
                <div className="payment-card-content">
                  <h4>{tenant ? tenant : "Unknown Tenant"}</h4>
                  <p>Amount: ₱{payment.payment_amount}</p>
                  <p>Date: {new Date(payment.payment_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                </div>
              </div>
            );
          })
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
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
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
            background-color: #333;
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
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            height: 100%;
            width: 100%;
          }

          .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            width: 400px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .payments-container {
            display: flex;
            flex-wrap: wrap;
            padding: 20px;
            gap: 20px;
          }

          .payment-card {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            width: 250px;
            position: relative;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
          }

          .payment-card-content p {
            font-size: 14px;
            margin: 5px 0;
          }
        `}
      </style>
    </div>
  );
};

export default PaymentAdmin;
