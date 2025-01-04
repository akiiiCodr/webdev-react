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
        const response = await fetch('http://localhost:5001/api/contracts'); // Replace with your API endpoint
        const data = await response.json();
        setContracts(data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    // Fetch tenants
    const fetchTenants = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/tenants'); // Replace with your tenants API endpoint
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
    // Trigger the download for the specific contract
    const downloadUrl = `http://localhost:5001/api/downloadContract/${contractId}`; // Modify as per your API
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Contract_${contractId}.docx`; // Provide the filename
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

// Styles
const containerStyle = {
  margin: '20px',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
};

const cardListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const contractCardStyle = {
  backgroundColor: '#fff',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
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

export default ContractCard;
