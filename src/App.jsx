import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
import TodoItem from './components/TodoItem'
import UserDropdown from './components/UserDropdown';

function App() {
  const [textInput, setTextInput] = useState("");
  const [userList, setUserList] = useState([]);
  const [todoList, setTodoList] = useState([]);

  const getUsers = async () => {
    console.log("We are in getUsers...")
    const response = await fetch('https://playground.4geeks.com/todo/users');
    if(response.ok) {
        const userData = await response.json();
        return userData;
    } else {
      console.log('error: ', response.status, response.statusText);
      return {error: {status: response.status, statusText: response.statusText}};
    }
  }
  
  const getTodos = async (user) => {
    const response = await fetch(`https://playground.4geeks.com/todo/users/${user.name}`);
    if (response.ok) {
        const data = await response.json();
        console.log("We got data.")
        console.log(data);
        return data;
    } else {
        console.log('error: ', response.status, response.statusText);
        return { todos: []};
    };
  };

  const updateUserListDropdown = (usersArray) => {
      if(usersArray) {
        setUserList(usersArray.map(user => ({
          id: user.id,
          name: user.name
        })));
      } else {
        console.log("No users found");
      }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getUsers();

      updateUserListDropdown(userData.users);
      /*
      if(userData.users) {
        setUserList(userData.users.map(user => ({
          id: user.id,
          name: user.name
        })));
      } else {
        console.log("No users found or there was an error");
        //setUserList([userListFromServer]);
      }
      */
    }

    fetchUsers();
  },[]);

  const handleUserSelect = async (user) => {
    console.log(`The selected User is: ${user.name}`);
    
    const todoData = await getTodos(user);

    setTodoList(
      todoData.todos.map(todo => ({
        id: todo.id,
        text: todo.label,
        isComplete: todo.is_done
      }))
    );
  }

  const onAddUser = async (username) => {
    const apiUrl = `https://playground.4geeks.com/todo/users/${username}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: username }) 
        });

        const data = await response.json(); // Parse JSON response
        console.log('API Response:', data);

        if (response.ok) {
            console.log('User created:', data);

            // Fetch updated users list (assuming you have a getUsers function)
            const userFetch = await getUsers();
            const updatedUsers = userFetch.users;

            console.log("we finished getting the users...")
            // Find the newly created user in the updated list
            console.log("And the user list is...", updatedUsers);

            updateUserListDropdown(updatedUsers);
            console.log("User list should have the new name.");

            const newUser = updatedUsers.find(user => user.name === username);

            if (newUser) {
                handleUserSelect(newUser); // Automatically select the new user
            }
        } else if (data.detail === "User already exists") {
            console.log('User already exists.');
        } else {
            console.error('Unexpected error:', data);
        }
    } catch (error) {
        console.error('Error handling user:', error);
    }
};



  const handleAdd = (e) => {
    if(e.key === "Enter"){
      const newTodo = {
        id: Date.now(),
        text: textInput ,
        isComplete: false
      };

      setTodoList([newTodo, ...todoList]);
      setTextInput("");
    }
  }

  const handleToggle = (id) => {
    setTodoList(todoList.map(todo => todo.id === id ? { ...todo, isComplete: !todo.isComplete }: todo));
  };

  const handleDelete = (id) => {
    setTodoList(todoList.filter(todo => todo.id !== id));
  }


  return (
    <>
    <div className='container myContainer'>
      <h1>Awesome Todo List!</h1>
      <UserDropdown 
        users={userList} 
        onUserSelect={handleUserSelect} 
        onAddUser={onAddUser}
      />
      <ul className='list-group'>
        <li className='list-group-item'>
        <input 
            className="myInput" 
            type="text" 
            placeholder="Add Todo here..."
            onChange={(e) => setTextInput(e.target.value)}
            value = {textInput}
            onKeyDown={handleAdd}    
        />
        </li>

        {todoList.map(todo => (
          <TodoItem
            key = {todo.id}
            id = {todo.id}
            text = {todo.text}
            isComplete = {todo.isComplete}
            handleToggle = {handleToggle}
            handleDelete = {handleDelete}
          />
        ))
        }
      </ul>
    </div>
    </>
  )
}

export default App
