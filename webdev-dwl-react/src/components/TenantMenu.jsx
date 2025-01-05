import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tenants from './Tenants';
import ToastNotification from './ToastNotification';

function TenantMenu() {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newLeaseDate, setNewLeaseDate] = useState('');
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
  const [hasLeaseEnd, setHasLeaseEnd] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // state for toast message
  const [toastType, setToastType] = useState(''); // state for toast type

    // Toggle the modal open state
    const toggleModal = () => setIsModalOpen((prev) => !prev);

    // Toggle the edit modal open state
    const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);

    // Toggle the edit modal open state
    const toggleLeaseModal = () => setLeaseModalEnd((prev) => !prev);

    // Toggle the edit modal open state
    const toggleLeaseModalExtend = () => setLeaseModalExtend((prev) => !prev);

  const formatDateForInput = (date) => {
    if (!date) return '';
    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset();
    localDate.setMinutes(localDate.getMinutes() - offset);
    return localDate.toISOString().split('T')[0];
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
      setTenantData((prev) => ({ ...prev, leaseEnd: '' }));
    }
  };

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tenants');
        setTenantData(response.data);
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
      setToastMessage('Tenant registered successfully!');
      setToastType('success');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error registering tenant:', error);
      setToastMessage('Failed to register tenant. Please try again.');
      setToastType('error');
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {};
      if (tenantData.name) payload.name = tenantData.name;
      if (tenantData.birthday) payload.birthday = tenantData.birthday;
      if (tenantData.email) payload.email = tenantData.email;
      if (tenantData.guardianName) payload.guardianName = tenantData.guardianName;
      if (tenantData.homeAddress) payload.homeAddress = tenantData.homeAddress;
      if (tenantData.rentalStart) payload.rentalStart = tenantData.rentalStart;
      if (tenantData.leaseEnd) payload.leaseEnd = tenantData.leaseEnd;
      if (tenantData.contactNo) payload.contactNo = tenantData.contactNo;

      payload.tenantId = tenantData.tenantId;

      const response = await axios.put('http://localhost:5001/api/tenants/editInfo', payload);
      console.log('Tenant updated successfully:', response.data);
      setToastMessage('Tenant updated successfully!');
      setToastType('success');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating tenant:', error);
      setToastMessage('An unexpected error occurred. Please try again.');
      setToastType('error');
    }
  };

  const handleTerminateLease = async (tenantId) => {
    if (!tenantId) return;
    const currentDate = new Date().toISOString().split('T')[0];

    try {
      await axios.put(`http://localhost:5001/api/tenants/terminateLease/${tenantId}`, {
        terminationDate: currentDate,
      });
      setToastMessage(`The lease for tenant ${tenantId} has been terminated.`);
      setToastType('success');
      setLeaseModalEnd(false);
      setSelectedTenant(null);
    } catch (error) {
      console.error('Error terminating lease:', error);
      setToastMessage('Failed to terminate the lease. Please try again.');
      setToastType('error');
    }
  };

  const handleExtendLease = async (tenantId) => {
    if (!newLeaseDate) {
      setToastMessage('Please select a new lease end date.');
      setToastType('error');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5001/api/tenants/extendLease/${tenantId}`, {
        leaseExtendDate: newLeaseDate,
      });

      if (response.data.success) {
        setToastMessage(`The lease for tenant ${tenantId} has been extended to ${newLeaseDate}.`);
        setToastType('success');
      } else {
        setToastMessage('Failed to extend the lease. Please try again.');
        setToastType('error');
      }

      setLeaseModalExtend(false);
      setNewLeaseDate('');
    } catch (error) {
      console.error('Error extending lease:', error);
      setToastMessage('An error occurred while extending the lease. Please try again.');
      setToastType('error');
    }
  };

  const handleEditModalOpen = async () => {
    if (!selectedTenant) return;

    try {
      const response = await axios.get(`http://localhost:5001/api/tenants/${selectedTenant}`);
      if (response.data) {
        setTenantData(response.data);
      } else {
        setToastMessage('Tenant data not found.');
        setToastType('error');
      }
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setToastMessage('Failed to fetch tenant data. Please try again.');
      setToastType('error');
    }
  };

  const handleTenantSelection = async (tenantId) => {
    setSelectedTenant(tenantId);

    try {
      const response = await axios.get(`http://localhost:5001/api/tenants/${tenantId}`);
      if (response.data) {
        setTenantData(response.data);
      } else {
        setToastMessage('Tenant data not found.');
        setToastType('error');
        setTenantData({});
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setToastMessage('Failed to fetch tenant data.');
      setToastType('error');
      setTenantData({});
    }
  };

  return (
    <div className="tenant-menu">
      <nav className="navbar">
        <div className="navbar-left">TENANT</div>
        <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
          <button className="menu-item" onClick={toggleModal}>Register Tenant</button>
          <button
            className={`menu-item ${!selectedTenant ? 'not-clickable' : ''}`}
            disabled={!selectedTenant}
            onClick={selectedTenant ? handleEditModalOpen : undefined}
          >
            Edit Info
          </button>
          <button
            className={`menu-item ${!selectedTenant ? 'not-clickable' : ''}`}
            disabled={!selectedTenant}
            onClick={selectedTenant ? toggleLeaseModal : undefined}
          >
            Terminate Lease
          </button>
          <button
            className={`menu-item ${!selectedTenant ? 'not-clickable' : ''}`}
            disabled={!selectedTenant}
            onClick={selectedTenant ? toggleLeaseModalExtend : undefined}
          >
            Extend Lease
          </button>
        </div>
      </nav>

      {/* Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Modal for adding a tenant */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="add_modal">
            <h2>Register Tenant</h2>
            <form onSubmit={handleFormSubmit}>
              <label>Tenant Name:
                <input type="text" name="name" value={tenantData.name} onChange={handleInputChange} required />
              </label>
              <label>Birthday:
                <input type="date" name="birthday" value={tenantData.birthday} onChange={handleInputChange} required />
              </label>
              <label>Contact No.:
                <input type="text" name="contactNo" value={tenantData.contactNo} onChange={handleInputChange} required />
              </label>
              <label>Email Address:
                <input type="email" name="email" value={tenantData.email} onChange={handleInputChange} required />
              </label>
              <label>Guardian Name:
                <input type="text" name="guardianName" value={tenantData.guardianName} onChange={handleInputChange} required />
              </label>
              <label>Home Address:
                <textarea name="homeAddress" value={tenantData.homeAddress} onChange={handleInputChange} required />
              </label>
              <label>Rental Start Date:
                <input type="date" name="rentalStart" value={tenantData.rentalStart} onChange={handleInputChange} required />
              </label>
              <label>
                <input type="checkbox" checked={hasLeaseEnd} onChange={handleLeaseEndToggle} />
                Lease End Date (optional)
              </label>
              {hasLeaseEnd && (
                <label>Lease End Date:
                  <input type="date" name="leaseEnd" value={tenantData.leaseEnd} onChange={handleInputChange} />
                </label>
              )}
              <button type="submit">Register</button>
              <button type="button" onClick={toggleModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="edit_modal">
            <h2>Edit Tenant</h2>
            <form onSubmit={handleEditFormSubmit}>
              <label>Tenant Name:
                <input type="text" name="name" value={tenantData.name} onChange={handleInputChange} required />
              </label>
              <label>Birthday:
                <input type="date" name="birthday" value={formatDateForInput(tenantData.birthday)} onChange={handleInputChange} required />
              </label>
              <label>Contact No.:
                <input type="text" name="contactNo" value={tenantData.contactNo} onChange={handleInputChange} required />
              </label>
              <label>Email Address:
                <input type="email" name="email" value={tenantData.email} onChange={handleInputChange} required />
              </label>
              <label>Guardian Name:
                <input type="text" name="guardianName" value={tenantData.guardianName} onChange={handleInputChange} required />
              </label>
              <label>Home Address:
                <textarea name="homeAddress" value={tenantData.homeAddress} onChange={handleInputChange} required />
              </label>
              <label>Rental Start Date:
                <input type="date" name="rentalStart" value={formatDateForInput(tenantData.rentalStart)} onChange={handleInputChange} required />
              </label>
              <label>
                <input type="checkbox" checked={hasLeaseEnd} onChange={handleLeaseEndToggle} />
                Lease End Date (optional)
              </label>
              {hasLeaseEnd && (
                <label>Lease End Date:
                  <input type="date" name="leaseEnd" value={tenantData.leaseEnd} onChange={handleInputChange} />
                </label>
              )}
              <button type="submit">Save Changes</button>
              <button type="button" onClick={toggleEditModal}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Lease Termination Modal */}
      {leaseModalEnd && (
        <div className="modal">
          <div className="modal-content">
            <h2>Terminate Lease</h2>
            <p>Are you sure you want to terminate the lease for tenant {tenantData.tenant_name}?</p>
            <button onClick={() => handleTerminateLease(selectedTenant)}>Yes</button>
            <button onClick={toggleLeaseModal}>No</button>
          </div>
        </div>
      )}

      {/* Lease Extension Modal */}
      {leaseModalExtend && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to extend the lease of {tenantData.tenant_name || 'this tenant'}?</h2>
            <label>New Lease End Date:
              <input
                type="date"
                value={newLeaseDate}
                onChange={(e) => setNewLeaseDate(e.target.value)}
                required
              />
            </label>
            <button onClick={() => handleExtendLease(selectedTenant)}>Extend</button>
            <button onClick={toggleLeaseModalExtend}>Cancel</button>
          </div>
        </div>
      )}

      {/* Tenant Selection for actions */}
      <Tenants selectedTenant={selectedTenant} onSelectTenant={handleTenantSelection} />
    </div>
  );
}

export default TenantMenu;
