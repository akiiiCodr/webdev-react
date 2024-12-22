import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Tenants({ selectedTenant, onSelectTenant }) {
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);

  // Fetch tenant data
  const fetchTenants = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/tenants');
      setTenants(response.data);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Failed to load tenants.');
    }
  };

  // Fetch data on component mount and set up polling
  useEffect(() => {
    fetchTenants();
    const interval = setInterval(() => {
      fetchTenants();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleTenantClick = (tenant) => {
    console.log('Clicked Tenant ID:', tenant.tenant_id);
    onSelectTenant(tenant.tenant_id);
  };

  return (
    <div className="tenants">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '10px', textAlign: 'right' }}>
        <i
          className="fa fa-refresh"
          onClick={fetchTenants}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: '#00aeff',
            padding: '10px',
          }}
          title="Refresh"
        ></i>
      </div>
      {tenants.length > 0 ? (
        <ul>
          {tenants.map((tenant) => {
            const calculateStayDuration = (startDate, endDate) => {
              const start = new Date(startDate);
              const end = endDate ? new Date(endDate) : new Date();

              const diffInMs = end - start;
              const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

              const years = Math.floor(diffInDays / 365);
              const months = Math.floor((diffInDays % 365) / 30);
              const days = diffInDays % 30;

              return { years, months, days };
            };

            const stayDuration = tenant.rental_start
              ? calculateStayDuration(tenant.rental_start, tenant.lease_end)
              : null;

            return (
              <li
                key={tenant.id}
                style={{
                  boxShadow: selectedTenant === tenant.tenant_id ? '0 0 10px #00aeff' : 'none',
                  padding: '10px',
                  margin: '5px 0',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'box-shadow 0.3s ease',
                }}
                onClick={() => handleTenantClick(tenant)}
              >
                {tenant.lease_end && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      color: '#fff',
                      borderRadius: '50%',
                      border: '2px solid #ff6347',
                      backgroundColor: "#ff6347",
                      fontWeight: 'bold',
                      fontSize: '20px',
                      textAlign: 'center',
                      width: '90px',
                      height: '90px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: 'rotate(-45deg)',
                    }}
                  >
                    LEASED
                  </span>
                )}
                <h2>{tenant.tenant_name}</h2>
                <p>Email: {tenant.email_address}</p>
                <p>Contact: {tenant.contact_no}</p>
                <p>Address: {tenant.home_address}</p>
                <p>Birthday: {formatDate(tenant.birthday)}</p>
                <p>Rental Start: {formatDate(tenant.rental_start)}</p>
                {tenant.lease_end ? (
                  <p>Lease End: {formatDate(tenant.lease_end)}</p>
                ) : (
                  <p>Lease End: Not specified</p>
                )}
                {stayDuration && tenant.lease_end && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#ffad38',
                      color: '#000',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      fontSize: '30px',
                      textAlign: 'center',
                    }}
                  >
                    {`${stayDuration.years}y ${stayDuration.months}m ${stayDuration.days}d`}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No tenants found.</p>
      )}
    </div>
  );
}

export default Tenants;
