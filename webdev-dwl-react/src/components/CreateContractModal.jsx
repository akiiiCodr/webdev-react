import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Alignment } from 'docx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPrint, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import ContractCard from './ContractCard';

const CreateContractModal = ({ show, handleClose, setGeneratedContract, tenants }) => {
  const [selectedTenant, setSelectedTenant] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [renteeName, setRenteeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentFee, setRentFee] = useState('');

  const generateContract = () => {
    if (!landlordName || !selectedTenant || !startDate || !rentFee) {
      alert('Please fill in all the required fields.');
      return;
    }

    const tenant = tenants.find((t) => t.tenant_id === selectedTenant);
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'RENTAL AGREEMENT',
                  font: 'Times New Roman',
                  size: 48, // 24pt
                  bold: true,
                  color: '000000', // Black color
                }),
              ],
              alignment: Alignment.CENTER,
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `This Rental Agreement ("Agreement") is made and entered into on ${new Date().toLocaleDateString()}, by and between:`,
                  font: 'Times New Roman',
                  size: 30,
                  bold: true,
                }),
              ],
              spacing: { after: 600 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Landlord: ${landlordName}`,
                  font: 'Times New Roman',
                  size: 30,
                }),
              ],
              alignment: Alignment.LEFT,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Rentee: ${renteeName}`,
                  font: 'Times New Roman',
                  size: 30,
                }),
              ],
              alignment: Alignment.LEFT,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Property: San Vicente East, Urdaneta City- Eldwins Apartment San Vicente, Urdaneta City, Pangasinan`,
                  font: 'Times New Roman',
                  size: 28,
                }),
              ],
              alignment: Alignment.LEFT,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `1. Term of Rental: The rental term will begin on ${startDate} and will end on ${endDate}.`,
                  font: 'Times New Roman',
                  size: 28,
                }),
              ],
              spacing: { before: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `2. Rent Fee: The monthly rent is Php ${rentFee}.00 payable on the due date of each month.`,
                  font: 'Times New Roman',
                  size: 28,
                }),
              ],
              spacing: { before: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `3. Payment Terms: Rent payments will be made to the Landlord by either cash or electronic payment modes. The rent is due on the due date of each month.`,
                  font: 'Times New Roman',
                  size: 28,
                }),
              ],
              spacing: { before: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `4. Security Deposit: A security deposit of Php 1300.00 is required at the signing of this agreement.`,
                  font: 'Times New Roman',
                  size: 28,
                }),
              ],
              spacing: { before: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `5. Responsibilities: The Rentee agrees to maintain the property in good condition and notify the Landlord of any necessary repairs.`,
                  font: 'Times New Roman',
                  size: 28,
                }),
              ],
              spacing: { before: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `6. Early Termination: Either party may terminate this contract by notifying the landlord written notice to the other party.`,
                  font: 'Times New Roman',
                  size: 28,
                }),
              ],
              spacing: { before: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `7. Additional Clauses: Any additional clauses regarding electricity bill and internet bill are excluded in the rent , etc.`,
                  font: 'Times New Roman',
                  size: 28,
                }),
              ],
              spacing: { before: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Signature of Landlord: ________________________',
                  font: 'Times New Roman',
                  size: 30, // 15pt
                }),
              ],
              spacing: { before: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Signature of Rentee: ________________________',
                  font: 'Times New Roman',
                  size: 30, // 15pt
                }),
              ],
              spacing: { before: 400 },
            }),
          ],
        },
      ],
    });

     const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // e.g., "20250104"
    let lastContractNumber = localStorage.getItem('lastContractNumber');
    lastContractNumber = lastContractNumber ? parseInt(lastContractNumber) + 1 : 1;
    const formattedContractNumber = String(lastContractNumber).padStart(4, '0');
    const filename = `EApt${currentDate}${formattedContractNumber}.docx`;
    localStorage.setItem('lastContractNumber', lastContractNumber);

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, filename); // Trigger file download

      const formData = new FormData();
      formData.append('tenant_id', selectedTenant); // Send the tenant_id
      formData.append('contractFile', blob, filename); // Append the generated file

      fetch('http://localhost:5001/api/uploadContract', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Contract uploaded successfully') {
            console.log(`Contract uploaded successfully: ${data.contract_id}`);
          } else {
            console.error('Failed to upload contract');
          }
        })
        .catch((error) => {
          console.error('Error uploading contract:', error);
        });

      setGeneratedContract(renteeName);
    });
  };


  if (!show) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContainerStyle}>
        {/* Close button */}
        <button style={closeButtonStyle} onClick={handleClose}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>
        <h2>Create Rental Contract</h2>
        <form>
          <div style={formGroupStyle}>
            <label>Landlord's Name</label>
            <input
              type="text"
              placeholder="Enter Landlord's Name"
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label>Tenant</label>
            <select
              value={selectedTenant}
              onChange={(e) => {
                const tenantId = e.target.value;
                setSelectedTenant(tenantId);

                const selectedTenantData = tenants.find((tenant) => tenant.tenant_id === tenantId);
                setRenteeName(selectedTenantData ? selectedTenantData.tenant_name : '');
              }}
              style={inputStyle}
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.tenant_id} value={tenant.tenant_id}>
                  {tenant.tenant_name} (ID: {tenant.tenant_id})
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Enter Rentee's Name"
            value={renteeName}
            onChange={(e) => setRenteeName(e.target.value)}
            style={inputStyle}
          />
          <div style={formGroupStyle}>
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label>Rent Fee</label>
            <input
              type="number"
              placeholder="Enter Rent Fee"
              value={rentFee}
              onChange={(e) => setRentFee(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="button" onClick={generateContract} style={navbarButtonStyle}>
            Generate Contract
          </button>
        </form>
      </div>
    </div>
  );
};

const RentalContractApp = () => {
  const [showModal, setShowModal] = useState(false);
  const [generatedContract, setGeneratedContract] = useState('');
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    // Fetch tenants dynamically from an API or database
    const fetchTenants = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/tenants'); // Replace with your actual API endpoint
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      }
    };

    fetchTenants();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div>
      <nav style={navbarStyle}>
        <button style={navbarButtonStyle} onClick={handleShow}>
          Create Contract
        </button>
      </nav>

      <CreateContractModal
        show={showModal}
        handleClose={handleClose}
        setGeneratedContract={setGeneratedContract}
        tenants={tenants}
      />

      <ContractCard/>
    </div>
  );
};


// Glassmorphic Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999, // Ensure the modal overlay is above all other elements
};

const modalContainerStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  width: '90%',
  maxWidth: '500px',
  padding: '20px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  color: '#fff',
  zIndex: 10000, // Ensure the modal container is on top of the overlay
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '24px',
  color: '#fff',
  cursor: 'pointer',
};

const navbarStyle = {
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'center',
  padding: '10px',
};

const navbarButtonStyle = {
  padding: '10px 20px',
  backgroundColor: 'rgba(0, 123, 255, 0.7)', // Semi-transparent background
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backdropFilter: 'blur(5px)',
};

const formGroupStyle = {
  marginBottom: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  marginTop: '5px',
  border: '1px solid rgba(255, 255, 255, 0.3)', // Light border for input
  borderRadius: '5px',
  background: 'rgba(255, 255, 255, 0.1)', // Light transparent background
  color: '#fff',
  backdropFilter: 'blur(5px)',
};

const cardListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const contractCardStyle = {
  background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
  backdropFilter: 'blur(10px)', // Apply blur effect for glass effect
  borderRadius: '15px',
  padding: '15px',
  border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for definition
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  color: '#fff', // Text color to contrast with background
  transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effect
};

const iconButtonStyle = {
  margin: '0 10px',
  padding: '10px',
  backgroundColor: 'rgba(0, 123, 255, 0.7)', // Semi-transparent background for buttons
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  backdropFilter: 'blur(5px)',
  display: 'inline-flex',
  alignItems: 'center',
};

// Styles for the generated contract button
const buttonGroupStyle = {
  marginTop: '10px',
};

const contractCardButtonStyle = {
  padding: '10px 15px',
  backgroundColor: 'rgba(0, 123, 255, 0.7)', // Semi-transparent
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backdropFilter: 'blur(5px)',
};

export default RentalContractApp;
