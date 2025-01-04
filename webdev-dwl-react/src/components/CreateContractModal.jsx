import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Alignment } from 'docx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPrint, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

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

        // Get the current date in YYYYMMDD format
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // e.g., "20250104"

        // Fetch the last generated contract number from local storage (or backend if needed)
        let lastContractNumber = localStorage.getItem('lastContractNumber');
        lastContractNumber = lastContractNumber ? parseInt(lastContractNumber) + 1 : 1;
    
        // Format the contract number as a four-digit number
        const formattedContractNumber = String(lastContractNumber).padStart(4, '0');
    
        // Construct the filename in the desired format
        const filename = `EApt${currentDate}${formattedContractNumber}.docx`;
    
            // Increment and save the contract number in localStorage
            localStorage.setItem('lastContractNumber', lastContractNumber);
    

    // Generate the contract and trigger download after successful creation
    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, filename);
        setGeneratedContract(renteeName); // Only set this after the contract is generated
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

      {generatedContract && (
        <div style={cardStyle}>
          <h3>Contract Generated for: {generatedContract}</h3>
          <div>
            <button
              style={iconButtonStyle}
              onClick={() => saveAs('Rental_Agreement.docx')}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
            <button style={iconButtonStyle} onClick={() => window.print()}>
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const navbarStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #ddd',
};

const navbarButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const cardStyle = {
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  width: '90%',
  maxWidth: '600px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const iconButtonStyle = {
  margin: '0 10px',
  padding: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
};

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
};

const modalContainerStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

const formGroupStyle = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};


export default RentalContractApp;
