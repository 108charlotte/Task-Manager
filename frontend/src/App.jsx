import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]); 
  const [username, setUsername] = useState(""); 

  const handleSubmit = (event) => {
    event.preventDefault(); 
    fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"username": username})
    })
      .then((response) => response.json())
      .then((tasks) => setTasks(tasks))
      .catch((error) => console.error("Error:", error));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Enter a username to see your tasks (case-sensitive)</label><br/><br/>
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/><br/>
        <br/>
        <button type="submit">See this user's tasks</button>
      </form>
      
      {
        <ul className="task-list-ul">
          {tasks.map((task, index) => (
            <li key={index}>{task.name}: {task.description}</li>
          ))}
        </ul>
      }
    </>
  )
}

export default App;