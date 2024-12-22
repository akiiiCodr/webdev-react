import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Tenants({ selectedTenant, onSelectTenant }) {
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);

  // Fetch tenant data on component mount
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tenants');
        setTenants(response.data);
      } catch (err) {
        console.error('Error fetching tenants:', err);
      }
    };

    fetchTenants();
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
    // Pass the tenant name to the onSelectTenant function
    onSelectTenant(tenant.tenant_name); // Pass the name to trigger the API call in TenantMenu
    console.log(`Tenant Name: ${tenant.tenant_name}`);
  };



  // const handleTenantClick = (tenant) => {
  //   console.log('Clicked Tenant ID:', tenant.tenant_id); // Log the tenant ID for debugging
  //   onSelectTenant(tenant.tenant_id); // Pass the ID to trigger the API call in the parent component
  // };
  
  

  return (
    <div className="tenants">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tenants.length > 0 ? (
        <ul>
          {tenants.map((tenant) => (
            <li
              key={tenant.id}
              style={{
                boxShadow: selectedTenant === tenant.tenant_name ? '0 0 10px #00aeff' : 'none',
                padding: '10px',
                margin: '5px 0',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
              }}
              onClick={() => handleTenantClick(tenant)}
            >
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
            </li>
          ))}
        </ul>
      ) : (
        <p>No tenants found.</p>
      )}
    </div>
  );
}

export default Tenants;
