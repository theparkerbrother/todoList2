import { useState } from 'react'
import './App.css'
import TodoItem from './components/TodoItem'

function App() {
  const [textInput, setTextInput] = useState("");
  const [todoList, setTodoList] = useState([]);

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
