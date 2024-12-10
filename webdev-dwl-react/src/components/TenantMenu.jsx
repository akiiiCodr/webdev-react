import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tenants from './Tenants';


function TenantMenu() {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [tenantData, setTenantData] = useState({
    name: '',
    birthday: '',
    contactNo: '',
    email: '',
    guardianName: '',
    homeAddress: '',
    rentalStart: '',
    leaseEnd: ''
  });
  const [hasLeaseEnd, setHasLeaseEnd] = useState(false); // State for lease end toggle

  // Toggle the menu open state
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Toggle the modal open state
  const toggleModal = () => setIsModalOpen((prev) => !prev);

    // Toggle the edit modal open state
    const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);

    const formatDateForInput = (date) => {
      if (!date) return ''; // Handle null or undefined date
      return new Date(date).toISOString().split('T')[0]; // Extract yyyy-MM-dd
    };
    

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenantData({ ...tenantData, [name]: value });
  };

  // Handle lease end toggle change
  const handleLeaseEndToggle = (e) => {
    setHasLeaseEnd(e.target.checked);
    if (!e.target.checked) {
      setTenantData((prev) => ({ ...prev, leaseEnd: '' })); // Reset leaseEnd when toggled off
    }
  };

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tenants');
        setTenants(response.data); // Assuming API returns a list of tenants
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      }
    };
    fetchTenants();
  }, []);



  // Submit form data to the backend API
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/tenants', tenantData);
      console.log('Tenant added successfully:', response.data);
      alert('Tenant registered successfully!');
      setIsModalOpen(false); // Close modal after successful submission
      // Optionally, refresh the tenant list here
    } catch (error) {
      console.error('Error registering tenant:', error);
      alert('Failed to register tenant. Please try again.');
    }
  };

    // Submit form data to the backend API
    const handleEditFormSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5001/api/tenants' , tenantData);
        console.log('Tenant added successfully:', response.data);
        alert('Tenant registered successfully!');
        setIsEditModalOpen(false); // Close modal after successful submission
        // Optionally, refresh the tenant list here
      } catch (error) {
        console.error('Error registering tenant:', error);
        alert('Failed to register tenant. Please try again.');
      }
    };


  
  




  const handleEditModalOpen = async () => {
    if (!selectedTenant) return;
  
    try {
      // Fetch tenant data from the API
      const response = await axios.get(`http://localhost:5001/api/tenants?name=${selectedTenant}`);
      if (response.data) {
        setTenantData(response.data); // Populate form data
      } else {
        alert('Tenant data not found.');
      }
      setIsEditModalOpen(true); // Open edit modal
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      alert('Failed to fetch tenant data. Please try again.');
    }
  };



  const handleTenantSelection = async (tenantId) => {
    console.log('Received Tenant ID:', tenantId);
    setSelectedTenant(tenantId);
  
    try {
      const response = await axios.get(`http://localhost:5001/api/tenants?id=${tenantId}`);
      console.log('Response data:', response.data);
  
      if (response.data && response.data.length > 0) {
        console.log('Fetched tenant data:', response.data[0]);
        setTenantData(response.data[0]); // Setting the first item from the response
      } else {
        alert('Tenant data not found.');
        setTenantData({});
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      alert('Failed to fetch tenant data.');
      setTenantData({});
    }
  };
  
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setTenantData({
      ...tenantData,
      [name]: value,
    });
  };
  
  
  

  return (
    <div className="tenant-menu">
      <nav className="navbar">
        <div className="navbar-left">TENANT</div>
        <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
          <button className="menu-item" onClick={toggleModal}>
            Register Tenant
          </button>
          <button
            className={`menu-item ${!selectedTenant ? 'not-clickable' : ''}`}
            disabled={!selectedTenant}
            onClick={selectedTenant ? handleEditModalOpen : undefined}
          >
            Edit Info
          </button>
          <button className={`menu-item ${!selectedTenant ? 'not-clickable' : ''}`} disabled={!selectedTenant}>
            Lease Tenant
          </button>
          <button className={`menu-item ${!selectedTenant ? 'not-clickable' : ''}`} disabled={!selectedTenant}>
            Extend Tenancy
          </button>
        </div>
      </nav>

        {/* Modal for adding a tenant */}
        {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Register Tenant</h2>
            <form onSubmit={handleFormSubmit}>
              
              <label>
                Tenant Name:
                <input
                  type="text"
                  name="name"
                  value={tenantData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Birthday:
                <input
                  type="date"
                  name="birthday"
                  value={tenantData.birthday}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Contact No.:
                <input
                  type="text"
                  name="contactNo"
                  value={tenantData.contactNo}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email Address:
                <input
                  type="email"
                  name="email"
                  value={tenantData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Guardian Name:
                <input
                  type="text"
                  name="guardianName"
                  value={tenantData.guardianName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Home Address:
                <textarea
                  name="homeAddress"
                  value={tenantData.homeAddress}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </label>
              <label>
                Rental Start Date:
                <input
                  type="date"
                  name="rentalStart"
                  value={tenantData.rentalStart}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={hasLeaseEnd}
                  onChange={handleLeaseEndToggle}
                />
                Lease End Date (optional)
              </label>
              {hasLeaseEnd && (
                <label>
                  Lease End Date:
                  <input
                    type="date"
                    name="leaseEnd"
                    value={tenantData.leaseEnd}
                    onChange={handleInputChange}
                  />
                </label>
              )}
              <button type="submit">Register</button>
              <button type="button" onClick={toggleModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen ? (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Tenant</h2>
            <form onSubmit={handleEditFormSubmit}>
              {/* Select Tenant Dropdown */}
              <label>
                Select Tenant:
                <select
                  value={selectedTenant || ''}
                  onChange={(e) => handleTenantSelection(e.target.value)} // Pass the tenant ID directly
                  required
                >
                  <option value="">-- Select a Tenant --</option>
                  {tenants.length > 0 ? (
                    tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.tenant_name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading tenants...</option>
                  )}
                </select>
              </label>

              {/* Form Fields */}
              <label>
                Tenant Name:
                <input
                  type="text"
                  name="tenant_name"
                  value={tenantData.tenant_name}
                  onChange={handleEditInputChange}
                  required
                />
              </label>

              <label>
                Birthday:
                <input
                  type="date"
                  name="birthday"
                  value={formatDateForInput(tenantData.birthday || '')}
                  onChange={handleEditInputChange}
                  required
                />
              </label>

              <label>
                Contact No.:
                <input
                  type="text"
                  name="contact_no"
                  value={tenantData.contact_no || ''}
                  onChange={handleEditInputChange}
                  required
                />
              </label>

              <label>
                Email Address:
                <input
                  type="email"
                  name="email_address"
                  value={tenantData.email_address || ''}
                  onChange={handleEditInputChange}
                  required
                />
              </label>

              <label>
                Guardian Name:
                <input
                  type="text"
                  name="guardian_name"
                  value={tenantData.guardian_name || ''}
                  onChange={handleEditInputChange}
                  required
                />
              </label>

              <label>
                Home Address:
                <textarea
                  name="home_address"
                  value={tenantData.home_address || ''}
                  onChange={handleEditInputChange}
                  required
                ></textarea>
              </label>

              <label>
                Rental Start Date:
                <input
                  type="date"
                  name="rental_start"
                  value={formatDateForInput(tenantData.rental_start || '')}
                  onChange={handleEditInputChange}
                  required
                />
              </label>

              {/* Lease End Date Toggle */}
              <label>
                <input
                  type="checkbox"
                  checked={hasLeaseEnd}
                  onChange={handleLeaseEndToggle}
                />
                Lease End Date (optional)
              </label>

              {hasLeaseEnd && (
                <label>
                  Lease End Date:
                  <input
                    type="date"
                    name="leaseEnd"
                    value={formatDateForInput(tenantData.lease_end || '')}
                    onChange={handleEditInputChange}
                  />
                </label>
              )}

              {/* Form Actions */}
              <div className="modal-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={toggleEditModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null} {/* Removed the <p>Loading tenant data...</p> */}




      {/* Tenant list */}
      <Tenants selectedTenant={selectedTenant} onSelectTenant={setSelectedTenant} />
    </div>
  );
}

export default TenantMenu;
