import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from backend API
    axios.get('http://localhost:5000/api/users')
      .then((response) => {
        setUsers(response.data); // Store the users data in state
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li> // Display users (assuming 'id' and 'name' columns)
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
