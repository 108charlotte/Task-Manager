import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]); 
  const [username, setUsername] = useState(""); 
  const [namefortask, setnamefortask] = useState(""); 
  const [descfortask, setdescfortask] = useState(""); 
  const [tasksLoaded, setTasksLoaded] = useState(false); 
  const [clickedTaskName, setClickedTaskName] = useState(""); 
  const [sendStatusUpdateRequest, setSendStatusUpdateRequest] = useState(false)

  useEffect(() => {
    if (sendStatusUpdateRequest) {
      fetch("http://localhost:8000/deletetask", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({"clickedtaskname": clickedTaskName, "usernamefortask": username})
      }).then((response) => response.json())
        .then((tasks) => setTasks(tasks))
        .catch((error) => console.log("Error:", error));  
      setSendStatusUpdateRequest(false); 
    }
  }, [sendStatusUpdateRequest]
)

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

  const deleteTask = (event) => {
    event.preventDefault(); 
    console.log(event.currentTarget.id); 
    setClickedTaskName(event.currentTarget.id); 
    setSendStatusUpdateRequest(true); {/* should make sure the clicked task name actually updates */}
  }

  return (
    <>
      <h1>Tasks Manger</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter a username to see your tasks (case-sensitive)</label><br/><br/>
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/><br/>
        <br/>
        <button type="submit">See this user's tasks</button>
      </form>
      
      {
        <ul className="task-list-ul">
          {/* need to make the : conditional on if there is a description */}
          {tasks.map((task, index) => (
            <li style={{textDecoration: task.completed ? 'line-through' : 'none'}} onClick={deleteTask} key={index} id={task.name}>{task.name}: {task.description}</li>
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