import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tenants from './Tenants';


function TenantMenu() {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newLeaseDate, setNewLeaseDate] = useState(''); // State to store selected new lease end date
  const [leaseModalEnd, setLeaseModalEnd] = useState(false);
  const [leaseModalExtend, setLeaseModalExtend] = useState(false);
  const [tenantData, setTenantData] = useState({
    tenantId: '',
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

    // Toggle the edit modal open state
    const toggleLeaseModal = () => setLeaseModalEnd((prev) => !prev);

    // Toggle the edit modal open state
    const toggleLeaseModalExtend = () => setLeaseModalExtend((prev) => !prev);


    const formatDateForInput = (date) => {
      if (!date) return ''; // Handle null or undefined date
      const localDate = new Date(date);
      const offset = localDate.getTimezoneOffset(); // Get the time zone offset in minutes
      localDate.setMinutes(localDate.getMinutes() - offset); // Adjust the date to the local time zone
      return localDate.toISOString().split('T')[0]; // Extract yyyy-MM-dd
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
        setTenantData(response.data); // Assuming API returns a list of tenants
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

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create a payload that only includes fields that have changed
      const payload = {};
      if (tenantData.name) payload.name = tenantData.name;
      if (tenantData.birthday) payload.birthday = tenantData.birthday;
      if (tenantData.email) payload.email = tenantData.email;
      if (tenantData.guardianName) payload.guardianName = tenantData.guardianName;
      if (tenantData.homeAddress) payload.homeAddress = tenantData.homeAddress;
      if (tenantData.rentalStart) payload.rentalStart = tenantData.rentalStart;
      if (tenantData.leaseEnd) payload.leaseEnd = tenantData.leaseEnd;
      if (tenantData.contactNo) payload.contactNo = tenantData.contactNo;
  
      // Include the tenant ID in the payload for identification
      payload.tenantId = tenantData.tenant_id;
  
      // Send PUT request to update tenant information
      const response = await axios.put('http://localhost:5001/api/tenants/editInfo', payload);
  
      // Log and notify the user of success
      console.log('Tenant updated successfully:', response.data);
      alert('Tenant updated successfully!');
  
      // Close the modal and optionally reset state
      setIsEditModalOpen(false);
  
      // Optional: Trigger a refresh for the tenant list if applicable
      // fetchTenantList(); // Example function call
    } catch (error) {
      console.error('Error updating tenant:', error);
  
      // Provide a user-friendly error message
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Failed to update tenant: ${error.response.data.error}`);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  

  const handleTerminateLease = async (tenantId) => {

  
    // Check if tenantData is available and contains the tenantId
    const tenant = tenantData?.find(tenant => tenant.tenant_id === tenantId);

    console.log('Received Tenant ID for Lease Termination:', tenant);
  
    if (!tenant) {
      // If tenant is not found in tenantData, make the API call
      try {
        const response = await axios.get(`http://localhost:5001/api/tenants/${tenantId}`);
        const tenantFromApi = response.data;
  
        // Check if the tenant data is valid
        if (!tenantFromApi) {
          console.error('Tenant not found');
          alert('Tenant not found. Please try again.');
          return;
        }
  
        console.log('Fetched tenant data:', tenantFromApi);
  
        // Set the selected tenant to the tenant ID (this should be after the tenant data is fetched)
        setTenantData(tenantId);
  
        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];
  
        // Send the termination request to the backend
        await axios.put(`http://localhost:5001/api/tenants/terminateLease/${tenantId}`, {
          terminationDate: currentDate,
        });
  
        console.log('Lease terminated successfully.');
        alert(`The lease for tenant ${tenantFromApi.tenant_name} (ID: ${tenantId}) has been terminated on ${currentDate}.`);
  
        // Reset selected tenant after termination
        setSelectedTenant(null);
      } catch (error) {
        console.error('Error terminating lease:', error);
        alert('Failed to terminate the lease. Please try again.');
      }
    } else {
      // If tenant is found in tenantData, use that directly
      console.log('Using tenant data from state:', tenant);
  
      // Set the selected tenant to the tenant ID
      setSelectedTenant(tenantId);
  
      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];
  
      // Send the termination request to the backend
      try {
        await axios.put(`http://localhost:5001/api/tenants/terminateLease/${tenantId}`, {
          terminationDate: currentDate,
        });
  
        console.log('Lease terminated successfully.');
        alert(`The lease for tenant ${tenant.tenant_name} (ID: ${tenantId}) has been terminated on ${currentDate}.`);
  
        // Reset selected tenant after termination
        setSelectedTenant(null);
      } catch (error) {
        console.error('Error terminating lease:', error);
        alert('Failed to terminate the lease. Please try again.');
      }
    }
  };




  const handleExtendLease = async (tenantId) => {
    if (!newLeaseDate) {
      alert('Please select a new lease end date.');
      return;
    }
  
    try {
      // Send the new lease end date to the backend
      const response = await axios.put(`http://localhost:5001/api/tenants/extendLease/${tenantId}`, {
        leaseExtendDate: newLeaseDate, // Send the new lease end date selected by the user
      });
  
      if (response.data.success) {
        alert(`The lease for tenant ${tenantId} has been extended to ${newLeaseDate}.`);
      } else {
        alert('Failed to extend the lease. Please try again.');
      }
  
      // Reset the modal and state
      setLeaseModalExtend(false);
      setNewLeaseDate('');
  
    } catch (error) {
      console.error('Error extending lease:', error);
      alert('An error occurred while extending the lease. Please try again.');
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
      // Fetch tenant data using the tenant ID as a route parameter
      const response = await axios.get(`http://localhost:5001/api/tenants/${tenantId}`);
      console.log('Response data:', response.data);
  
      if (response.data) {
        console.log('Fetched tenant data:', response.data);
        setTenantData(response.data); // Set the fetched tenant data
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
  
  // const handleEditInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setTenantData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  
  
  
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
          {/* Button to trigger the lease termination modal */}
          <button
            className={`menu-item ${!selectedTenant ? 'not-clickable' : ''}`}
            disabled={!selectedTenant}
            onClick={selectedTenant ? toggleLeaseModal : undefined}
          >
            Lease Tenant
          </button> 
          <button
          className={`menu-item ${!selectedTenant ? 'not-clickable' : ''}`}
          disabled={!selectedTenant}
          onClick={selectedTenant ? toggleLeaseModalExtend : undefined}
          >
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
                >
                  <option value="">-- Select a Tenant --</option>
                  {tenantData.length > 0 ? (
                    tenantData.map((tenant) => (
                      <option key={tenant.tenant_id} value={tenant.tenant_id}>
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
                  value={tenantData.tenant_name || ''}
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




      {/* Modal for lease termination or extension confirmation */}
      {leaseModalEnd && tenantData && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              Are you sure you want to terminate the lease of {tenantData.name || 'this tenant'}?
            </h2>
            
            {/* Confirm Termination Button */}
            <button onClick={() => handleTerminateLease(selectedTenant)}>Terminate Lease</button>
            

            {/* Cancel Button */}
            <button onClick={() => setLeaseModalEnd(false)}>Cancel</button>
          </div>
        </div>
      )}

            {/* Modal for lease termination or extension confirmation */}
            {leaseModalExtend && tenantData && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              Are you sure you want to extend the lease of {tenantData.name || 'this tenant'}?
            </h2>

            {/* Date picker for the user to select the new lease end date */}
            <label htmlFor="leaseExtendDate">New Lease Date:</label>
            <input
              type="date"
              id="leaseExtendDate"
              value={newLeaseDate}
              onChange={(e) => setNewLeaseDate(e.target.value)}
            />
            
            {/* Confirm Extend Button */}
            <button onClick={() => handleExtendLease(selectedTenant)}>Extend</button>
            

            {/* Cancel Button */}
            <button onClick={() => setLeaseModalExtend(false)}>Cancel</button>
          </div>
        </div>
      )}






      {/* Tenant list */}
      <Tenants selectedTenant={selectedTenant} onSelectTenant={setSelectedTenant} />
    </div>
  );
}

export default TenantMenu;
