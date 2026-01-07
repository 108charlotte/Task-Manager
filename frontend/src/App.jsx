import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]); 
  const [username, setUsername] = useState(""); 
  const [namefortask, setnamefortask] = useState(""); 
  const [descfortask, setdescfortask] = useState(""); 
  const [tasksLoaded, setTasksLoaded] = useState(false); 
  const [style, setStyle] = useState("uncrossed")

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
    
    setTasksLoaded(true); 
  }

  const addTask = (event) => {
    event.preventDefault(); 
    fetch("http://localhost:8000/addtask", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({"taskname": namefortask, "taskdesc": descfortask, "username": username})
    }).then((response) => response.json())
      .then((tasks) => setTasks(tasks))
      .catch((error) => console.error("Error:", error)); 
  }

  const changeCrossthrough = () => {
    if (style !== "crossed") setStyle("crossed"); 
    else setStyle("uncrossed"); 
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
            <li className={style} onClick={changeCrossthrough} key={index}>{task.name}: {task.description}</li>
          ))}
        </ul>
      }
      {tasksLoaded && (
        <form onSubmit={addTask}>
          <label>Write the name and (optionally) a short description of a task for this user: </label><br /><br />
          <input type="text" id="namefortask" name="namefortask" value={namefortask} onChange={(e) => setnamefortask(e.target.value)}/><br/>
          <input type="text" id="descfortask" name="descfortask" value={descfortask} onChange={(e) => setdescfortask(e.target.value)}/><br/>
          <br />
          <button type="submit">Add a new task</button>
        </form>
        
        )
      }
    </>
  )
}

export default App;