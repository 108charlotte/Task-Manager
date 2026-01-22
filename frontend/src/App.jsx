import { useState, useEffect } from 'react'; 
import './App.css'; 
import { useLocation } from 'react-router-dom'; 
import { getCookie } from './csrftoken.jsx'; 
import { useNavigate } from 'react-router-dom'; 

function App() {
  const location = useLocation();

  const [tasks, setTasks] = useState([]); 
  const [username, setUsername] = useState(location.state?.username || ""); 
  const [namefortask, setnamefortask] = useState(""); 
  const [descfortask, setdescfortask] = useState(""); 
  const [tasksLoaded, setTasksLoaded] = useState(false); 
  const [clickedTaskName, setClickedTaskName] = useState(""); 
  const [sendStatusUpdateRequest, setSendStatusUpdateRequest] = useState(false); 
  const [errorForUser, setErrorForUser] = useState(""); 

  const navigate = useNavigate(); 

  function getTasksForUsername() {
    fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        "X-CSRFToken": getCookie('csrftoken'),
      },
      credentials: "include", 
      body: JSON.stringify({"username": username})
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setErrorForUser(data.error);
          setTasks([]);
          setTasksLoaded(false);
        } else {
          setTasks(data);
          setTasksLoaded(true);
          setErrorForUser("");
        }
      })
      .catch((error) => {
        console.error("Error:", error); 
        setErrorForUser("Error retrieving tasks for " + username);
        setTasksLoaded(false);
      });
  }

  useEffect(() => {
      fetch("http://localhost:8000/authentication/login", {
          method: "GET",
          credentials: "include",
      }).catch((error) => console.error("CSRF token retrieval error:", error));
  }, []);

  useEffect(() => {
    if (sendStatusUpdateRequest) {
      fetch("http://localhost:8000/deletetask", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
          "X-CSRFToken": getCookie('csrftoken'),
        }, 
        credentials: "include", 
        body: JSON.stringify({"clickedtaskname": clickedTaskName, "usernamefortask": username})
      })
      .then(response => response.json())
      .then((error) => {
        if (error.error == "None, successfully deleted task") {
          getTasksForUsername();
        } else {
          setErrorForUser(error.error);  
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        setErrorForUser("Error deleting task");
      });  
      setSendStatusUpdateRequest(false); 
    }
  }, [sendStatusUpdateRequest, clickedTaskName, username])

  const handleSubmit = (event) => {
    event.preventDefault(); 
    getTasksForUsername();
  }

  const addTask = (event) => {
    event.preventDefault(); 
    setErrorForUser("");
    fetch("http://localhost:8000/addtask", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
        "X-CSRFToken": getCookie('csrftoken'),
      }, 
      credentials: "include", 
      body: JSON.stringify({"taskname": namefortask, "taskdesc": descfortask, "username": username})
    })
    .then(response => response.json())
    .then((error) => {
      if (error.error == "None, successfully added task") {
        getTasksForUsername();
        setnamefortask("");
        setdescfortask("");
      } else {
        setErrorForUser(error.error); 
      }
    })
    .catch((error) => {console.error("Error:", error); setErrorForUser("Error adding task")}); 
  }

  const deleteTask = (event) => {
    event.preventDefault(); 
    setClickedTaskName(event.currentTarget.id); 
    setErrorForUser("");
    setSendStatusUpdateRequest(true);
  }

  const logout = (event) => {
    event.preventDefault(); 
    setErrorForUser("");
    fetch("http://localhost:8000/authentication/logout", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
        "X-CSRFToken": getCookie('csrftoken'),
      }, 
      credentials: "include", 
      body: JSON.stringify({"username": location.state?.activeUserUsername})
    }).then((response) => response.json())
    .then((error) => {
      if (error.error == "None, logged out successfully") {
        navigate("/"); 
      } else {
        console.error("Error:", error.error); 
        setErrorForUser(error.error); 
      }
    })
  }

  return (
    <>
      <h1>Tasks Manager</h1>
      {location.state?.activeUserUsername ? (
        <>
          <p>Welcome {location.state?.activeUserUsername}! </p>
          <form onSubmit={logout}><CSRFToken /><button type="submit">Log out</button></form>
          <div className="username-form">
            <form onSubmit={handleSubmit}>
              <CSRFToken />
              <label>Enter a username to see their tasks (case-sensitive)</label><br/><br/>
              <input type="text" id="username" name="username" value={username} onChange={(e) => {setUsername(e.target.value); setTasksLoaded(false); }}/><br/>
              <br/>
              <button type="submit">See this user's tasks</button>
            </form>
          </div>

          <div className="error">
            <p>{errorForUser}</p>
          </div>
          {tasks.length == 0 && tasksLoaded ? (
            <div className="task-list"><p>This user doesn't have any tasks right now! </p></div>
          ) : tasksLoaded && 
            <div className="task-list">
              <p>Tasks: </p>
              <ul className="task-list-ul">
                {tasks.map((task, index) => (
                  <li onClick={deleteTask} key={index} id={task.name}>{task.name}: {task.description}</li>
                ))}
              </ul>
            </div>
          }
          {tasksLoaded && location.state?.activeUserUsername == username && (
            <div className="add-task">
              <form onSubmit={addTask}>
                <CSRFToken />
                <label>Write the name and (optionally) a short description of a task for this user: </label><br /><br />
                <input type="text" id="namefortask" name="namefortask" value={namefortask} onChange={(e) => {setnamefortask(e.target.value); setErrorForUser("");}}/><br/>
                <input type="text" id="descfortask" name="descfortask" value={descfortask} onChange={(e) => {setdescfortask(e.target.value); setErrorForUser("");}}/><br/>
                <br />
                <button type="submit">Add a new task</button>
              </form>
            </div>
          )}
        </>
      ) : 
      <p>Log in <a href="/login">here</a>, or if you don't have an account, register <a href="/register">here</a>! </p>}
    </>
  )
}

export default App;