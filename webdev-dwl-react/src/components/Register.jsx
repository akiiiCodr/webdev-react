import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEye, faEyeSlash, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ToastNotification from "./ToastNotification";

const Register = () => {
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
    const alphanumericPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
    const symbolPattern = /[!@#$%^&*(),.?":{}|<>]/;

    setPasswordRequirements({
      alphanumeric: alphanumericPattern.test(password),
      symbol: symbolPattern.test(password),
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
                <FontAwesomeIcon icon={faArrowRight} />
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
                      <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
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
                          : "red",
                    }}
                  >
                    {passwordStrength}
                  </p>
                  <div
                    style={{
                      ...styles.passwordStrengthBar,
                      width:
                        passwordStrength === "Strong"
                          ? "100%"
                          : passwordStrength === "Normal"
                          ? "60%"
                          : "30%",
                      backgroundColor:
                        passwordStrength === "Strong"
                          ? "green"
                          : passwordStrength === "Normal"
                          ? "orange"
                          : "red",
                    }}
                  ></div>
                  <div style={styles.passwordRequirements}>
                    <p
                      style={{
                        color: passwordRequirements.alphanumeric ? "green" : "red",
                      }}
                    >
                      Alphanumeric: {passwordRequirements.alphanumeric ? "✔️" : "❌"}
                    </p>
                    <p
                      style={{
                        color: passwordRequirements.symbol ? "green" : "red",
                      }}
                    >
                      Contains Symbol: {passwordRequirements.symbol ? "✔️" : "❌"}
                    </p>
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
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              )}
              {index === 6 && (
                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option value="">Select Account</option>
                  <option value="Student">Student</option>
                  <option value="Guest">Guest</option>
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
                    <FontAwesomeIcon icon={faArrowLeft} /> Previous
                  </button>
                  <button onClick={handleNext} style={styles.nextButton}>
                    Next <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <ToastNotification message={toastMessage} type={toastType} onClose={handleCloseToast} />
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "700px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
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
    border: "2px solid #ccc",
    lineHeight: "30px",
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "16px",
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
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "20px",
  },
  prevButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    flex: 1,
  },
  nextButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    width: "100%",
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



export default Register;
