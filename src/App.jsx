import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
import TodoItem from './components/TodoItem'

function App() {
  const [textInput, setTextInput] = useState("");
  const [todoList, setTodoList] = useState([]);

  const getData = async () => {
    const response = await fetch('https://playground.4geeks.com/todo/users/meItsMe');
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.log('error: ', response.status, response.statusText);
        /* Handle the error returned by the HTTP request */
        return {error: {status: response.status, statusText: response.statusText}};
    };
};

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getData();
      if(data.todos){
        setTodoList(
          data.todos.map(todo => ({
            id: todo.id,
            text: todo.label,
            isComplete: todo.is_done
          }))
        );
      } else {
        console.log("No todos found or there was an error");
      }
    };

    fetchTodos();
  },[]);


  const handleAdd = (e) => {
    if(e.key === "Enter"){
      const newTodo = {
        id: Date.now(),
        text: textInput ,
        isComplete: false
      };

      /*
      fetch('https://playground.4geeks.com/todo/todos/meItsMe', {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(resp => {
          console.log(resp.ok); // Will be true if the response is successful
          console.log(resp.status); // The status code=201 or code=400 etc.
          console.log(resp.text()); // Will try to return the exact result as a string
          return resp.json(); // (returns promise) Will try to parse the result as JSON and return a promise that you can .then for results
      })
      .then(data => {
          // Here is where your code should start after the fetch finishes
          console.log(data); // This will print on the console the exact object received from the server
      })
      .catch(error => {
          // Error handling
          console.error(error);
      });
      */


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
