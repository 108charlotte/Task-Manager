import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]); 
  const [username, setUsername] = useState(""); 
  const [namefortask, setnamefortask] = useState(""); 
  const [descfortask, setdescfortask] = useState(""); 
  const [tasksLoaded, setTasksLoaded] = useState(false); 
  const [clickedTaskName, setClickedTaskName] = useState(""); 
  const [sendStatusUpdateRequest, setSendStatusUpdateRequest] = useState(false); 
  const [errorForUser, setErrorForUser] = useState(""); 
  const [numTasks, setNumTasks] = useState(0); {/* will allow me to know if a new task has been added/deleted and if not explain why to the user */}
  const [addTaskRequest, setAddTaskRequest] = useState(false); 

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
        .catch((error) => {
          console.log("Error:", error);
          setErrorForUser("Error deleting task");
        });  
      setSendStatusUpdateRequest(false); 
    }
  }, [sendStatusUpdateRequest, clickedTaskName, username])

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
      .then((tasks) => {setTasks(tasks); setNumTasks(tasks.length)})
      .catch((error) => console.error("Error:", error));
    
    setTasksLoaded(true); 
  }

  const addTask = (event) => {
    event.preventDefault(); 
    setErrorForUser(""); {/* remove error by default, then add it back later if necessary */}
    fetch("http://localhost:8000/addtask", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({"taskname": namefortask, "taskdesc": descfortask, "username": username})
    }).then((response) => response.json())
      .then((tasks) => {
        if (tasks.length == numTasks) {
          setErrorForUser("Please enter a task with a unique name for this username");
        } else {
          setTasks(tasks);
          setNumTasks(tasks.length); {/* this new task length will be 1 greater than previously */}
        }
      })
      .catch((error) => console.error("Error:", error)); 
  }

  const deleteTask = (event) => {
    event.preventDefault(); 
    console.log(event.currentTarget.id); 
    setClickedTaskName(event.currentTarget.id); 
    setErrorForUser(""); {/* for some reason this isn't clearing the error for user */}
    setSendStatusUpdateRequest(true); {/* should make sure the clicked task name actually updates */}
  }

  return (
    <>
      <h1>Tasks Manager</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter a username to see their tasks (case-sensitive)</label><br/><br/>
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/><br/>
        <br/>
        <button type="submit">See this user's tasks</button>
      </form>

      <p>{errorForUser}</p>
      
      {
        <ul className="task-list-ul">
          {/* need to make the : conditional on if there is a description */}
          {tasks.map((task, index) => (
            <li onClick={deleteTask} key={index} id={task.name}>{task.name}: {task.description}</li>
          ))}
        </ul>
      }
      {tasksLoaded && (
        <form onSubmit={addTask}>
          <label>Write the name and (optionally) a short description of a task for this user: </label><br /><br />
          <input type="text" id="namefortask" name="namefortask" value={namefortask} onChange={(e) => {setnamefortask(e.target.value); setErrorForUser("");}}/><br/> {/* error not getting set */}
          <input type="text" id="descfortask" name="descfortask" value={descfortask} onChange={(e) => {setdescfortask(e.target.value); setErrorForUser("");}}/><br/> {/* error not getting set */}
          <br />
          <button type="submit">Add a new task</button>
        </form>
        )
      }
    </>
  )
}

export default App;