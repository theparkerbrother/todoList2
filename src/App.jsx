import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
import TodoItem from './components/TodoItem'
import UserDropdown from './components/UserDropdown';

function App() {
  const [textInput, setTextInput] = useState("");
  const [userList, setUserList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const addToDo = async (todo) => {
    console.log("I'm in addToDo");
    console.log("The todo I am adding is",todo);
    try {
      const apiUrl = `https://playground.4geeks.com/todo/todos/${selectedUser.name}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          label: todo.label,
          is_done: false
        })
      });
      
      console.log(response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("To-Do added:", data);
      return data;
    } catch (error) {
      console.error("Failed to add To-Do:", error);
      throw error;
    }
  };

  const toggleTodo = async (id , newCheckedValue) => {
    console.log(`I'm in toggleTodo, the id is ${id}, the newCheckedValue is ${newCheckedValue}`);
    try {
      const apiUrl = `https://playground.4geeks.com/todo/todos/${id}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_done: newCheckedValue
        })
      })

      console.log(`The respons from the toggle update is:`,response);

      if (!response.ok){
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      setTodoList(todoList.map(todo => todo.id === id ? { ...todo, is_done: !todo.is_done }: todo));

    } catch (error) {
      console.error("Failed to toggle todo:", error);
      throw error;
    }
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

  const updateToDoList = async (user) => {
    const todoData = await getTodos(user);

    setTodoList(
      todoData.todos.map(todo => ({
        id: todo.id,
        label: todo.label,
        is_done: todo.is_done
      }))
    );
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getUsers();

      updateUserListDropdown(userData.users);
    }

    fetchUsers();
  },[]);

  const handleUserSelect = async (user) => {
    console.log(`The selected User is: ${user.name}`);
    setSelectedUser(user);
    updateToDoList(user);
    /*
    const todoData = await getTodos(user);

    setTodoList(
      todoData.todos.map(todo => ({
        id: todo.id,
        text: todo.label,
        isComplete: todo.is_done
      }))
    );
    */
   console.log(`selected user, from useState is`,selectedUser)
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



  const handleAdd = async (e) => {
    //console.log("SelectedUser is",selectedUser);
    if (e.key === "Enter" && selectedUser) {
      const newTodo = {
        // id: Date.now(), // You might not need this if the API handles IDs
        label: textInput,
        is_done: false
      };

      try {
        const addedTodo = await addToDo(newTodo);
        setTodoList([addedTodo, ...todoList]);
        setTextInput("");
      } catch (error) {
        console.error("Error adding todo:", error);
        // Optionally, add user feedback here (e.g., a notification)
      }
    }
  };

  const handleToggle = (id,is_done) => {
    toggleTodo(id, !is_done);
  };

  const handleDelete = async (id) => {
    console.log(`I'm in handleDelete, the id is ${id}`);
    try {
      const apiUrl = `https://playground.4geeks.com/todo/todos/${id}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      })

      console.log(`The respons from the DELETE is:`,response);

      if (!response.ok){
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      setTodoList(todoList.filter(todo => todo.id !== id));

    } catch (error) {
      console.error("Failed to delete todo:", error);
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    console.log(`I'm in handleDeleteUser`);
    try {
      const apiUrl = `https://playground.4geeks.com/todo/users/${selectedUser.name}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      })

      console.log(`The response from the User DELETE is:`,response);

      if (!response.ok){
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      setTodoList([]);
      setSelectedUser(null);
      const userData = await getUsers();
      setUserList(userData.users);


    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };


  return (
    <>
    <div className='container myContainer'>
      <h1>Todo List 2</h1>
      <UserDropdown 
        users={userList}
        selectedUser={selectedUser} 
        onUserSelect={handleUserSelect} 
        onAddUser={onAddUser}
      />
      <button className="btn btn-danger mb-3" onClick={handleDeleteUser}>
        <i className="fa-solid fa-user-slash"></i> Delete User
      </button>
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
            label = {todo.label}
            is_done = {todo.is_done}
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
