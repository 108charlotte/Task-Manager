import { useState, useEffect } from 'react'; 
import './AuthLayout.css'; 
import { getCookie } from './csrftoken.jsx'; 
import { useNavigate } from 'react-router-dom'; 

const url = import.meta.env.VITE_FETCH_URL

function Register() {
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [errorForUser, setErrorForUser] = useState(""); 

    const navigate = useNavigate(); 

    // sends initial CSRF token request
    useEffect(() => {
        fetch(url + "/authentication/login", {
            method: "GET",
            credentials: "include",
        }).catch((error) => console.error("CSRF token retrieval error:", error));
    }, []);

    const register = (event) => {
        event.preventDefault(); 
        fetch(url + "/authentication/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken'),
          },
          credentials: "include",
          body: JSON.stringify({ "username": username, "password": password, "confirm_password": confirmPassword })
        })
        .then((response) => response.json())
        .then((error) => {
            {/* using this sort of error passing from the backend helps me provide the user with more specific feedback */}
            if (error.error == "None, user creation successful") {
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
                <form onSubmit={register}>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/><br/>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
                    <label htmlFor="password">Confirm password: </label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/><br/>
                    <button type="submit">Register</button>
                </form>
            </div>
            <p>Already have an account? Log in <a href="/login">here</a></p>
        </>
    )
}

export default Register;