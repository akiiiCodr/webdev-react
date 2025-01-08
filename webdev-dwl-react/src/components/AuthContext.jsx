import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in when the app loads
    const checkAuthentication = async () => {
      try {
        const authResponse = await axios.get("http://localhost:5001/api/current-user", {
          withCredentials: true,
        });

        if (authResponse.data && authResponse.data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuthentication();
  }, []);


    // Second useEffect: Fetch tenant status if user is authenticated
    useEffect(() => {
      const fetchTenantStatus = async () => {
          try {
            const tenantResponse = await axios.get(`http://localhost:5001/api/login/active?username=${usernameOrEmail}&password=${password}`);
  
            if (tenantResponse.data.tenant) {
              const activeTenant = tenantResponse.data.tenant.active;
             
              if (activeTenant === "1") {
                setIsLoggedIn(true);
              } else {
                setIsLoggedIn(false);
              }
            } else {
              setIsLoggedIn(false); // No tenant found
            }
          } catch (err) {
            console.error("Error fetching tenant status:", err);
            setIsLoggedIn(false);
          }
      };
  
      fetchTenantStatus();
    }, []); 

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
