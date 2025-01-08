import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEye, FaArrowLeft, FaArrowRight, FaRegEyeSlash, FaCheck, FaTimes, } from 'react-icons/fa';
import ToastNotification from "./ToastNotification";
import BGM from "../assets/gradient-image.svg";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    account_type: "",
    password: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    alphanumeric: false,
    symbol: false,
  });

  const steps = ["Username", "Name", "Contact", "Password", "Birth", "Gender", "Account Type", "Submit"];

  const handleNext = () => {
    if (currentStep < steps.length && !isSubmitting) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1 && !isSubmitting) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        account_type: formData.account_type,
        password: formData.password,
      };

      const response = await axios.post("http://localhost:5001/signup", payload);

      if (response.status === 200) {
        setToastMessage("Account created successfully!");
        setToastType("success");
        setShowToast(true);
        setFormData({
          username: "",
          name: "",
          email: "",
          phone: "",
          dob: "",
          gender: "",
          account_type: "",
          password: "",
        });
      } else {
        setToastMessage("Something went wrong, please try again.");
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setToastMessage("An error occurred. Please try again later.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      checkPasswordStrength(value);
      checkPasswordRequirements(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    const strongPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;\"'<>,.?/~`]).{8,}$/;
    const normalPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

    if (password.length < 6) {
      setPasswordStrength("Short");
    } else if (strongPasswordPattern.test(password)) {
      setPasswordStrength("Strong");
    } else if (normalPasswordPattern.test(password)) {
      setPasswordStrength("Normal");
    } else {
      setPasswordStrength("Short");
    }
  };

  const checkPasswordRequirements = (password) => {
    // Check for alphanumeric characters (at least one letter and one digit)
    const alphanumericPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
    // Check for symbols (special characters)
    const symbolPattern = /[!@#$%^&*(),.?":{}|<>]/;
  
    // Check if the password meets both alphanumeric and symbol conditions
    const isAlphanumeric = alphanumericPattern.test(password);
    const hasSymbol = symbolPattern.test(password);
  
    setPasswordRequirements({
      alphanumeric: isAlphanumeric,
      symbol: hasSymbol,
    });
  };
  
  

  const getPageStyle = () => {
    return {
      transform: `translateX(-${(currentStep - 1) * 100}%)`,
      transition: "transform 0.5s ease-in-out",
      display: "flex",
    };
  };

  const isActive = (step) => step <= currentStep;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


    useEffect(() => {
      // Apply background image to the body of the page
      document.body.style.backgroundImage = `url(${BGM})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.minHeight = '100vh'; // Ensure body covers the entire viewport height
  
      return () => {
        // Clean up background styles when component is unmounted
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        document.body.style.backgroundRepeat = '';
        document.body.style.minHeight = '';
      };
    }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>Registration Form</header>

      {/* Progress Bar */}
      <div style={styles.progressBar}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              ...styles.step,
              ...(isActive(index + 1) ? styles.activeStep : {}),
            }}
          >
            <p style={styles.stepText}>{step}</p>
            <div style={styles.bullet}>
              <span>{index + 1}</span>
            </div>
            {isActive(index + 1) && index < steps.length - 1 && (
              <div style={styles.arrowRight}>
                <FaArrowRight />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Pages */}
      <div style={styles.formOuter}>
        <div style={{ ...styles.pages, ...getPageStyle() }}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                ...styles.page,
                visibility: isActive(index + 1) ? "visible" : "hidden",
                opacity: isActive(index + 1) ? 1 : 0,
                transition: "visibility 0s 0.5s, opacity 0.5s",
              }}
            >
              <h2 style={styles.title}>Step {index + 1}: {step}</h2>
              {index === 0 && (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  style={styles.input}
                />
              )}
              {index === 1 && (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  style={styles.input}
                />
              )}
              {index === 2 && (
                <>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    style={styles.input}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    style={styles.input}
                  />
                </>
              )}
              {index === 3 && (
                <>
                  <div style={styles.passwordContainer}>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      style={styles.input}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>

                  <p
                    style={{
                      ...styles.passwordStrength,
                      color:
                        passwordStrength === "Strong"
                          ? "green"
                          : passwordStrength === "Normal"
                          ? "orange"
                          : passwordStrength === "Short"
                          ? "red"
                          : "gray", // Default to gray if passwordStrength is not set
                    }}
                  >
                    {passwordStrength || "Enter a password"} {/* Show message if passwordStrength is not set */}
                  </p>

                  <div
                    style={{
                      ...styles.passwordStrengthBar,
                      width:
                        passwordStrength === "Strong"
                          ? "100%"
                          : passwordStrength === "Normal"
                          ? "60%"
                          : passwordStrength === "Short"
                          ? "30%"
                          : "0%", // No width if passwordStrength is not set
                      backgroundColor:
                        passwordStrength === "Strong"
                          ? "green"
                          : passwordStrength === "Normal"
                          ? "orange"
                          : passwordStrength === "Short"
                          ? "red"
                          : "transparent", // No color if passwordStrength is not set
                    }}
                  ></div>

                  <div style={styles.passwordRequirements}>
                    <p
                      style={{
                        color: passwordRequirements.alphanumeric ? "green" : "red",
                      }}
                    >
                      Alphanumeric: {passwordRequirements.alphanumeric ? <FaCheck/> : <FaTimes/>}
                    </p>
                    <p
                      style={{
                        color: passwordRequirements.symbol ? "green" : "red",
                      }}
                    >
                      Contains Symbol: {passwordRequirements.symbol ? <FaCheck/> : <FaTimes/>}
                    </p>
                    {(passwordRequirements.alphanumeric && passwordRequirements.symbol) && (
                      <p style={{ color: "green" }}><FaCheck/> Both requirements met</p>
                    )}
                  </div>
                </>
              )}
              {index === 4 && (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              )}
              {index === 5 && (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option value="" style={{ color: "black" }}>Select Gender</option>
                  <option value="Male" style={{ color: "black" }}>Male</option>
                  <option value="Female" style={{ color: "black" }}>Female</option>
                  <option value="Other" style={{ color: "black" }}>Other</option>
                </select>
              )}
              {index === 6 && (
                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option value="" style={{ color: "black" }} >Select Account</option>
                  <option value="Student" style={{ color: "black" }} >Student</option>
                  <option value="Guest" style={{ color: "black" }} >Guest</option>
                </select>
              )}
              {index === 7 && (
                <button onClick={handleSubmit} style={styles.submitButton}>
                  Submit
                </button>
              )}
              {index !== 7 && (
                <div style={styles.buttonContainer}>
                  <button onClick={handlePrev} style={styles.prevButton}>
                    <FaArrowLeft /> Previous
                  </button>
                  <button onClick={handleNext} style={styles.nextButton}>
                    Next <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Toast Notification */}
      {showToast && (
        <ToastNotification message={toastMessage} type={toastType} onClose={handleCloseToast} />
      )}
      </div>

      
    </div>
    
  );
  
};

const iconStyle = {
  fontSize: '40px',
  color: '#000',
  marginBottom: '10px',
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "700px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    background: "rgba(255, 255, 255, 0.1)", // Semi-transparent white background
    backdropFilter: "blur(10px)", // Apply the blur effect
    border: "1px solid rgba(255, 255, 255, 0.2)", // Light border to simulate frosted glass
    boxSizing: "border-box",
    color: "#fff", // Text color for visibility on the glass
  },
  header: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#fff", // Ensure header text is readable on the glass
  },
  progressBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  step: {
    textAlign: "center",
    position: "relative",
  },
  activeStep: {
    color: "#4caf50",
  },
  bullet: {
    display: "inline-block",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "2px solid #fff", // White border for contrast on glass
    lineHeight: "30px",
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "16px",
    color: "#fff", // Bullet color on the glass
  },
  arrowRight: {
    fontSize: "20px",
    color: "#4caf50",
    position: "absolute",
    right: "-15px",
    top: "10px",
  },
  formOuter: {
    overflow: "hidden",
    position: "relative",
  },
  pages: {
    display: "flex",
    transition: "transform 0.5s ease-in-out",
  },
  page: {
    minWidth: "100%",
    padding: "20px",
  },
  title: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#fff", // Title color for contrast
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.3)", // Soft border for inputs
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent input background
    fontSize: "16px",
    color: "#fff", // Input text color for contrast
    outline: "none", // Remove outline on focus
    transition: "border 0.3s ease",
  },
  inputFocus: {
    borderColor: "#4caf50", // Focus border color to indicate active input
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "20px",
  },
  prevButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    padding: "10px 20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    cursor: "pointer",
    flex: 1,
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
  },
  nextButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    padding: "10px 20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    cursor: "pointer",
    flex: 1,
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
  },
  submitButton: {
    backgroundColor: "rgba(76, 175, 80, 0.8)", // Semi-transparent green
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
  },
  passwordStrength: {
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "5px",
  },
  passwordStrengthBar: {
    height: "8px",
    backgroundColor: "#ddd",
    borderRadius: "4px",
    marginTop: "10px",
    transition: "width 0.3s ease",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  passwordRequirements: {
    marginTop: "10px",
  },
};




export default Signup;
