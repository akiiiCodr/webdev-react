import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ToastNotification from "./ToastNotification.jsx"; // Import your ToastNotification component

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
  const [avatar, setAvatar] = useState({});

  // Helper function to format the date in Month Day, Year format
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate;
  };

  const formatBirthdayToUTC = (birthday) => {
    if (!birthday) return "";
  
    // Create a Date object from the birthday string
    const date = new Date(birthday);
  
    // Ensure the date is correctly formatted as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0]; // Get the date part (YYYY-MM-DD)
  
    return formattedDate;
  };

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
  
      if (response.data) {
        // Show a success toast message
        setToastMessage("Successfully logged out! Redirecting...");
        setToastType("success");
        setShowToast(true); // Show toast
  
        // Wait a bit before redirecting (e.g., 1500ms)
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login page
        }, 1500); // Adjust delay as needed
      } else {
        setError(response.data || "Error logging out");
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
    const { name, value, files } = e.target;
  
    // Handle special case for birthday (since it's a date input)
    if (name === "birthday") {
      setUpdatedDetails(prevState => ({
        ...prevState,
        [name]: value, // Set date as string in YYYY-MM-DD format
      }));
    } else if (name === "avatar" && files && files.length > 0) {
      // Handle avatar file upload
      setUpdatedDetails(prevState => ({
        ...prevState,
        [name]: files[0], // Store the file object for avatar
      }));
    } else {
      // For other fields (text inputs, etc.)
      setUpdatedDetails(prevState => ({
        ...prevState,
        [name]: value, // Update the state with the new value
      }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file); // Append the avatar file to the form data
      setImagePreview(URL.createObjectURL(file));
  
      fetch(`http://localhost:5001/api/tenants/update/${tenant_id}`, {
        method: 'PUT',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log("Image uploaded successfully:", data);
      })
      .catch(error => {
        console.error("Error uploading image:", error);
      });
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    
    // Debugging - log the updatedDetails
    console.log(updatedDetails);
    
    if (updatedDetails.tenant_name && updatedDetails.tenant_name.trim() !== "") {
      formData.append("tenant_name", updatedDetails.tenant_name);
    }
    
    if (updatedDetails.username && updatedDetails.username.trim() !== "") {
      formData.append("username", updatedDetails.username);
    }
    
    if (updatedDetails.birthday) {
      formData.append("birthday", updatedDetails.birthday);
    }
    
    if (updatedDetails.avatar && updatedDetails.avatar instanceof File) {
      formData.append("avatar", updatedDetails.avatar);
    }
  
    try {
      const response = await axios.put(
        `http://localhost:5001/api/tenants/update/${tenant_id}`,
        formData
      );
  
      console.log(response.data);  // Debugging the response
  
      if (response.data) {
        setToastMessage("Tenant details updated successfully!");
        setToastType("success");
        setShowToast(true);
  
        const avatarPath = response.data.avatarPath;
        if (avatarPath && avatarPath !== "No avatar updated") {
          setImagePreview(avatarPath);
        }
  
        setTenantDetails(updatedDetails);
        setIsEditing(false);
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

  useEffect(() => {
    if (tenant_id) {
      fetchAvatar(tenant_id);
    }
  }, [tenant_id]);

  const fetchAvatar = async (tenant_id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/tenants/avatar/${tenant_id}`);
  
      if (response.data.avatarPath) {
        console.log("Avatar path:", response.data.avatarPath);
        // Update the imagePreview state with the fetched avatar path
        setAvatar(response.data.avatarPath);
      } else {
        // Handle the case where avatarPath is not found in the response
        console.log("Avatar not found for this tenant.");
        setAvatar("/assets/ike.jpg"); // Set a default avatar
      }
    } catch (err) {
      console.error("Error fetching avatar:", err);
      // Set a default avatar in case of error
      setAvatar("/assets/ike.jpg");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const age = tenantDetails.birthday ? calculateAge(tenantDetails.birthday) : "N/A";
  const rentalDuration = tenantDetails.rental_start ? calculateRentalDuration(tenantDetails.rental_start) : "N/A";
  const formattedBirthday = tenantDetails.birthday ? formatDate(tenantDetails.birthday) : "N/A";

  return (
    <>
      {/* Conditionally render ToastNotification outside of the card */}
      {showToast && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
  
      {/* Modal for Editing outside of the card */}
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
  
      {/* Tenant Profile Card */}
      <div style={styles.card}>
        <img
          src={`/${avatar}` || "/assets/ike.jpg"} // Show the uploaded image, the updated avatar path, or the default one
          alt="Tenant"
          style={styles.image}
        />
        <div style={styles.cardBody}>
          {/* Regular View Mode */}
          {!isEditing && (
            <div>
              <h2 style={styles.title}>Name: {tenantDetails.tenant_name || "N/A"}</h2>
              <h2 style={styles.title}>Username: {tenantDetails.username || "N/A"}</h2>
              <p style={styles.text}>Age: {age}</p>
              <p style={styles.text}>Birthday: {formattedBirthday}</p>
              <p style={styles.text}>Duration: {rentalDuration !== "N/A" ? `${rentalDuration} days` : "N/A"}</p>
              <button style={styles.editButton} onClick={() => setIsEditing(true)}>Edit</button>
              <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  card: {
    width: "300px",
    border: "1px solid rgba(255, 255, 255, 0.2)", // Semi-transparent border
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
    margin: "20px auto",
    textAlign: "center",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
    backdropFilter: "blur(10px)", // Frosted glass effect
    color: "#fff", // Light text for better contrast
    padding: "20px",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  cardBody: {
    padding: "15px",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "24px",
    color: "#fff",
  },
  text: {
    margin: "5px 0",
    fontSize: "16px",
    color: "#ddd", // Light gray text for readability
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
    position: 'fixed', /* Change from 'relative' to 'fixed' */
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Semi-transparent backdrop */
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, /* Ensures the modal is on top of all other elements */
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    zIndex: 1001, /* Ensure modal content is on top of the backdrop */
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', /* Optional: Add shadow for a subtle effect */
  },
};

export default TenantProfile;
