import './style.css'
import { useState, useEffect } from 'react'; 

function App() {
  // persists tasks if already there? 
  const [tasks, setTasks] = useState([]); 

  // uses a get request to retreive the user's tasks
  const getTasks = async () => {
    const response = await fetch("http://localhost:4000"); 
    setTasks(await response.json()); 
  }

  // runs getTasks when the page loads
  useEffect(() => {
    getTasks(); 
  }, [])
  
  // returns a list of tasks for the user
  return (
    <ul>
      {tasks.map((task) => {
        return (
          <li key={task.id}>{task.title}</li>
        )
      })}
    </ul>
  )
}

export default App; 
