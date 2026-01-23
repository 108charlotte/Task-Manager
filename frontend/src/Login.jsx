import { useState, useEffect } from 'react'; 
import './AuthLayout.css'; 
import { getCookie } from './csrftoken.jsx'; 
import { useNavigate } from 'react-router-dom'; 

const url = import.meta.env.VITE_FETCH_URL

function Login() {
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [errorForUser, setErrorForUser] = useState(""); 

    const navigate = useNavigate(); 

    // sends initial CSRF token request
    useEffect(() => {
        fetch(url + ":8000/authentication/login", {
            method: "GET",
            credentials: "include",
        }).catch((error) => console.error("CSRF token retrieval error:", error));
    }, []);

    const login = (event) => {
        event.preventDefault(); 
        fetch(url + ":8000/authentication/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken'),
          },
          credentials: "include",
          body: JSON.stringify({ "username": username, "password": password })
        })
        .then((response) => response.json())
        .then((error) => {
            if (error.error == "None, login successful") {
                navigate('/', { state: { username: username, activeUserUsername: username } })
            } else {
                console.error("Error:", error.error); 
                setErrorForUser(error.error)
            }}
        )
        .catch((error) => {console.error("Error:", error); setErrorForUser("There was an error logging you in")});
    }

    return (
        <>
            <div className="error">
                <p>{errorForUser}</p>
            </div>
            <div className="form">
                <form onSubmit={login}>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/><br/>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
                    <button type="submit">Log in</button>
                </form>
            </div>
            <p>Don't have an account? Register <a href="/register">here</a></p>
        </>
    )
}

export default Login;