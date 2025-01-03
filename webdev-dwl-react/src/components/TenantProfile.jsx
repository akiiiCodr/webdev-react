import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ToastNotification from "./ToastNotification.jsx"; // Import your ToastNotification component

// Helper function to format the date in Month Day, Year format
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
};

const formatBirthdayToUTC = (birthday) => {
  if (birthday) {
    const date = new Date(birthday);
    return date.toISOString().substring(0, 10); // Converts to ISO format (YYYY-MM-DD)
  }
  return "";
};


const TenantProfile = ({ username }) => {
  const [tenantDetails, setTenantDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");  // State for toast message
  const [toastType, setToastType] = useState("");        // State for toast type (success, error, warning)
  const [showToast, setShowToast] = useState(false);     // State to control whether to show toast
  const [isEditing, setIsEditing] = useState(false);     // State to toggle between view and edit mode
  const [updatedDetails, setUpdatedDetails] = useState({}); // State to store updated details for editing
  const [imagePreview, setImagePreview] = useState(null);  // State to store image preview
  const { tenant_id } = useParams(); // Get tenant details from the URL

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
          const tenantData = response.data.tenant["0"];
          setTenantDetails(tenantData);
          setUpdatedDetails(tenantData); // Initialize updatedDetails with current tenant data
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
  

  const handleLogout = async () => {
    setLoading(true);  // Start loading state

    try {
      // Make the API request to set the tenant as inactive
      const response = await axios.post("http://localhost:5001/api/tenants/logout", {
        username: tenantDetails.username,
      });

      if (response.data.success) {
        // Show a success toast message
        setToastMessage("Successfully logged out! Redirecting...");
        setToastType("success");
        setShowToast(true); // Show toast

        // Wait a bit before redirecting
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login page
        }, 1500); // Adjust delay as needed
      } else {
        setError(response.data.message || "Error logging out");
        setToastMessage("Error logging out.");
        setToastType("error");
        setShowToast(true); // Show error toast
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setToastMessage("Error logging out. Please try again later.");
      setToastType("error");
      setShowToast(true); // Show error toast
    } finally {
      setLoading(false);  // Stop loading state once the process is finished
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
  
    // Handle special case for birthday (since it's a date input)
    if (name === "birthday") {
      // Ensure the value is in the correct format (YYYY-MM-DD)
      setUpdatedDetails(prevState => ({
        ...prevState,
        [name]: value, // Set date as string in YYYY-MM-DD format
      }));
    } else {
      setUpdatedDetails(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview of the selected image
      setImagePreview(URL.createObjectURL(file));
      setUpdatedDetails(prevState => ({
        ...prevState,
        profile_image: file, // Save the file in the updatedDetails state for form submission
      }));
    }
  };
  

  const handleSaveChanges = async () => {
    const formData = new FormData();
    for (const key in updatedDetails) {
      if (updatedDetails[key] !== null && updatedDetails[key] !== "" && updatedDetails[key] !== undefined) {
        formData.append(key, updatedDetails[key]);
      }
    }
  
    try {
      const response = await axios.put(`http://localhost:5001/api/tenants/update/${tenant_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data.success) {
        setToastMessage("Tenant details updated successfully!");
        setToastType("success");
        setShowToast(true);
  
        // If avatar was updated, update the tenant image preview with the new avatar path
        const avatarPath = response.data.avatarPath; // Get the avatar path from the response
        if (avatarPath !== "No avatar updated") {
          setImagePreview(avatarPath); // Update the image preview with the new file path
        }
  
        setTenantDetails(updatedDetails); // Update the tenant details
        setIsEditing(false); // Exit edit mode
      } else {
        setToastMessage(response.data.message || "Error updating tenant details.");
        setToastType("error");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Error updating tenant details:", err);
      setToastMessage("Error updating tenant details. Please try again.");
      setToastType("error");
      setShowToast(true);
    }
  };
  
  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const age = tenantDetails.birthday ? calculateAge(tenantDetails.birthday) : "N/A";
  const rentalDuration = tenantDetails.rental_start ? calculateRentalDuration(tenantDetails.rental_start) : "N/A";
  const formattedBirthday = tenantDetails.birthday ? formatDate(tenantDetails.birthday) : "N/A";

  return (
    <div style={styles.card}>
      <img
        src={imagePreview || tenantDetails.avatar || "/src/assets/ike.jpg"} // Show the uploaded image or the default one
        alt="Tenant"
        style={styles.image}
      />
      <div style={styles.cardBody}>
        {/* Modal for Editing */}
        {isEditing && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
            <h2>Edit Profile</h2>

            <label>Name:</label>
            <input
              type="text"
              name="tenant_name"
              value={updatedDetails.tenant_name || ""}
              onChange={handleEditChange}
              style={styles.input}
            />

            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={updatedDetails.username || ""}
              onChange={handleEditChange}
              disabled
              style={styles.input}
            />

            <label>Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={formatBirthdayToUTC(updatedDetails.birthday) || ""}
              onChange={handleEditChange}
              style={styles.input}
            />

            <label>Profile Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              style={styles.input}
            />

              <div>
                <button onClick={handleSaveChanges} style={styles.saveButton}>Save Changes</button>
                <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Regular View Mode */}
        {!isEditing && (
          <div>
            <h2 style={styles.title}>Name: {tenantDetails.tenant_name || "N/A"}</h2>
            <h2 style={styles.title}>Username: {tenantDetails.username || "N/A"}</h2>
            <p style={styles.text}>Age: {age}</p>
            <p style={styles.text}>Birthday: {formattedBirthday}</p>
            <p style={styles.text}>Duration: {rentalDuration !== "N/A" ? `${rentalDuration} days` : "N/A"}</p>

            {/* Edit Button */}
            <button style={styles.editButton} onClick={() => setIsEditing(true)}>Edit</button>

            {/* Logout Button */}
            <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        )}

        {/* Conditionally render ToastNotification */}
        {showToast && (
          <ToastNotification
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
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
    position: "relative", // Ensure card elements do not overlap modal
  },
  image: {
    width: "100%",
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
  logoutButton: {
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#FF4C4C",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editButton: {
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  modal: {
    position: 'fixed', /* Fixed positioning to overlay on top of the screen */
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Semi-transparent background */
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, /* Ensures modal is on top of all other elements */
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    zIndex: 10000, /* Makes sure content within the modal is on top of the modal overlay */
  },
};


export default TenantProfile;
