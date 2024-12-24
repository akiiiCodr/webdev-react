import React, { useEffect, useState } from "react";
import axios from "axios";

// Helper function to format the date in Month Day, Year format
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
};

const TenantProfile = ({ username }) => {
  const [tenantDetails, setTenantDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to calculate age
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Helper function to calculate rental duration
  const calculateRentalDuration = (rentalStart) => {
    const rentalStartDate = new Date(rentalStart);
    const currentDate = new Date();
    const timeDiff = currentDate - rentalStartDate;
    const days = Math.floor(timeDiff / (1000 * 3600 * 24)); // Calculate the difference in days
    return days >= 0 ? days : 0; // Ensure non-negative duration
  };

  useEffect(() => {
    const fetchTenantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/user/tenants?username=${username}`);
        if (response.data && response.data.tenant && response.data.tenant["0"]) {
          setTenantDetails(response.data.tenant["0"]);
        } else {
          setError("Tenant details not found.");
        }
      } catch (err) {
        console.error("Error fetching tenant details:", err);
        setError("Error loading tenant data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantDetails();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const age = tenantDetails.birthday ? calculateAge(tenantDetails.birthday) : "N/A";
  const rentalDuration = tenantDetails.rental_start ? calculateRentalDuration(tenantDetails.rental_start) : "N/A";
  const formattedBirthday = tenantDetails.birthday ? formatDate(tenantDetails.birthday) : "N/A";
  const formattedRentalStart = tenantDetails.rental_start ? formatDate(tenantDetails.rental_start) : "N/A";

  return (
    <div style={styles.card}>
      <img
        src="/src/assets/ike.jpg"
        alt="Tenant"
        style={styles.image}
      />
      <div style={styles.cardBody}>
        <h2 style={styles.title}>Name: {tenantDetails.tenant_name || "N/A"}</h2>
        <h2 style={styles.title}>Username: {tenantDetails.username || "N/A"}</h2>
        <p style={styles.text}>Age: {age}</p>
        <p style={styles.text}>Birthday: {formattedBirthday}</p>
        <p style={styles.text}>Rental Start: {formattedRentalStart}</p>
        <p style={styles.text}>Duration: {rentalDuration !== "N/A" ? `${rentalDuration} days` : "N/A"}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
    margin: "20px auto",
    textAlign: "center",
  },
  image: {
    width: "80%",
    height: "auto",
    margin: "10px 0 0 0",
  },
  cardBody: {
    padding: "15px",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "24px",
    color: "#333",
  },
  text: {
    margin: "5px 0",
    fontSize: "16px",
    color: "#666",
  },
};

export default TenantProfile;
