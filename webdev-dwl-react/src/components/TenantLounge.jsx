import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TenantProfile from './TenantProfile';

function TenantLounge() {
  const { username } = useParams(); // Get the username from URL params
  const [tenantDetails, setTenantDetails] = useState(null); // State to hold tenant details
  const [activeContent, setActiveContent] = useState('content1'); // Default content
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(""); // State to handle errors

  // Fetch tenant details when the component mounts
  useEffect(() => {
    const fetchTenantDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/user/tenants?username=${username}`
        ); // Send username as query parameter
        console.log("Fetched tenant data:", response.data);

        if (response.data && response.data.tenant && response.data.tenant["0"]) {
          setTenantDetails(response.data.tenant["0"]); // Extract tenant data from the "0" key
        } else {
          setError("Tenant details not found.");
        }
      } catch (err) {
        console.error("Error fetching tenant details:", err);
        setError("Failed to load tenant data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantDetails();
  }, [username]); // Dependency on username

  // Function to show specific content
  const showContent = (contentId) => {
    setActiveContent(contentId);
  };

  return (
    <div>
      <div>
        <div className="left-sidebar">
          {/* Tenant Profile */}
          {loading ? (
            <p>Loading tenant data...</p> // Display loading message
          ) : error ? (
            <p>{error}</p> // Display error message if any
          ) : tenantDetails ? (
            <TenantProfile
              name={tenantDetails.tenant_name || "N/A"}
              username={tenantDetails.username || "N/A"}
              age={tenantDetails.age || "N/A"}
              birthday={tenantDetails.birthday || "N/A"}
              rentalStart={tenantDetails.rental_start || "N/A"}
              duration={tenantDetails.duration || "N/A"}
            />
          ) : (
            <p>No tenant details available.</p>
          )}

          {/* Sidebar Navigation */}
          <div
            className={`rectangle_tenant ${activeContent === 'content1' ? 'active' : ''}`}
            onClick={() => showContent('content1')}
          >
            Payments
          </div>
          <div
            className={`rectangle_tenant ${activeContent === 'content2' ? 'active' : ''}`}
            onClick={() => showContent('content2')}
          >
            Contract
          </div>
          <div
            className={`rectangle_tenant ${activeContent === 'content3' ? 'active' : ''}`}
            onClick={() => showContent('content3')}
          >
            Information
          </div>
        </div>

        {/* Content Viewer */}
        <div className="content-viewer-tenant">
          <div
            id="content1"
            className={`viewer-content ${activeContent === 'content1' ? 'active' : ''}`}
          >
            <h3>Payments</h3>
            <p>Payment details will be displayed here.</p>
          </div>
          <div
            id="content2"
            className={`viewer-content ${activeContent === 'content2' ? 'active' : ''}`}
          >
            <h3>Contracts</h3>
            <p>Contract details will be displayed here.</p>
          </div>
          <div
            id="content3"
            className={`viewer-content ${activeContent === 'content3' ? 'active' : ''}`}
          >
            <h3>Information</h3>
            <p>General tenant information will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantLounge;
