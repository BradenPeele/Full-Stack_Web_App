import React, {useState, useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../helpers/AuthContext";

/*
    checks if username and password match
    if they do
        put signed token in local storage and set authstate to update the navbar
*/
function Login() {

    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);
  
    const login = () => {
        const data = { username: username, password: password };
        axios.post("http://localhost:3001/users/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem("access_token", response.data.token);
                setAuthState({username: response.data.username, id: response.data.id, status: true});
                navigate("/");
            }
         });
    };

    return (
        <div className="login_container">
            <label>Username:</label>
            <input
                type="text"
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />
            <button onClick={login}> Login </button>
        </div>
    );
  }
  
  export default Login;