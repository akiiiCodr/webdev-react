import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPrint } from '@fortawesome/free-solid-svg-icons';

const ContractCard = () => {
  const [contracts, setContracts] = useState([]);
  const [tenants, setTenants] = useState([]);

  // Fetch contracts and tenants on component mount
  useEffect(() => {
    // Fetch contracts
    const fetchContracts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/contracts');
        const data = await response.json();
        setContracts(data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    // Fetch tenants
    const fetchTenants = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/tenants');
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };

    fetchContracts();
    fetchTenants();
  }, []);

  // Find the tenant info based on tenant_id
  const getTenantInfo = (tenantId) => {
    const tenant = tenants.find((tenant) => tenant.tenant_id === tenantId);
    return tenant ? tenant : {}; // If tenant not found, return empty object
  };

  const handleDownload = (contractId) => {
    const downloadUrl = `http://localhost:5001/api/downloadContract/${contractId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Contract_${contractId}.docx`;
    link.click();
  };

  return (
    <div style={containerStyle}>
      <h2>Generated Contracts</h2>
      <div style={cardListStyle}>
        {contracts.length === 0 ? (
          <p>No contracts available.</p>
        ) : (
          contracts.map((contract) => {
            const tenantInfo = getTenantInfo(contract.tenant_id);
            return (
              <div key={contract.contract_id} style={contractCardStyle}>
                <h4>Contract for Tenant: {tenantInfo.tenant_name || 'N/A'}</h4>
                <p>Contract ID: {contract.contract_id}</p>
                <div style={buttonGroupStyle}>
                  {/* Download Button */}
                  <button style={iconButtonStyle} onClick={() => handleDownload(contract.contract_id)}>
                    <FontAwesomeIcon icon={faDownload} /> Download
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Glassmorphic Styles


const containerStyle = {
  margin: '20px',
  padding: '20px',
  background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
  backdropFilter: 'blur(10px)', // Apply the blur effect for the glassmorphic look
  borderRadius: '15px', // Rounded corners
  border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for definition
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
  color: '#fff', // Text color to contrast with background
};


const cardListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};


const buttonGroupStyle = {
  marginTop: '10px',
};

const iconButtonStyle = {
  marginRight: '10px',
  padding: '8px 15px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
};


const contractCardStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  padding: '15px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  color: '#000',
  transition: 'transform 0.3s, box-shadow 0.3s',
  zIndex: 1, // Set the card's z-index lower than the modal
};

export default ContractCard;
