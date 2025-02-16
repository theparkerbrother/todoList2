import React, { useState } from 'react';

const UserDropdown = ({ users, selectedUser, onUserSelect, onAddUser }) => {
  // State to track the selected user
  //const [selectedUser, setSelectedUser] = useState(null);

  // Handle the selection of a user
  const handleUserSelect = (user) => {
    if (user.id === "new") {
      const userName = prompt("Please enter a new user name:");
  
      if (userName) {
        // Proceed with creating the new user
        console.log(`New user name: ${userName}`);
        // Call your function to add a new user (e.g., save to state or server)
        onAddUser(userName);

        //setSelectedUser({ name: userName });
      }
    } else {
      if (onUserSelect) {
        console.log(`The selected User is: ${user.name}`); // Debugging log
        onUserSelect(user);
      }
    }
  };
  
  return (
    
    <div className="dropdown mb-3 mt-3">
      <button
        className="btn btn-secondary dropdown-toggle myButton"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedUser ? selectedUser.name : "Select User"}  {/* Display selected user name */}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li key={"new"}>
          <a
              className="dropdown-item"
              href="#"
              onClick={() => handleUserSelect({ id: "new", name: "➕ Add New User"})}
            >
              ➕ Add New User
            </a>
        </li>
        {users.map(user => (
          <li key={user.id}>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => handleUserSelect(user)}  // Set selected user on click
            >
              {user.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDropdown;

