import './app.css';
import {BrowserRouter, Route, Routes, Link} from'react-router-dom';
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import {AuthContext} from "./helpers/AuthContext";
import {useState, useEffect} from "react";
import axios from "axios";

function App() {

  const [authState, setAuthState] = useState({username: "", id: 0, status: false});

  // update authState for displaying register/login in navbar
  useEffect(() => {
    axios.get("http://localhost:3001/users/auth", { 
      headers: {access_token: localStorage.getItem("access_token")}
    }).then((response) => {
        if(response.data.error) {
        setAuthState({...authState, status: false});
      } else {
        setAuthState({username: response.data.username, id: response.data.id, status: true});
      }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    setAuthState({username: "", id: 0, status: false});

  };

  return (
    <div className="app"> 
      <AuthContext.Provider value={{authState, setAuthState}}>
        <BrowserRouter>
          <div className = "navbar"> 
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login"> Login </Link>
                  <Link to="/register"> Register </Link>
                </>
              ) : (
                <>
                 <Link to="/"> Home </Link>
                 <Link to="/CreatePost"> Create Post </Link>
                </>
              )}
            </div>
            <div className="logged_in_container">
              <Link to={`/profile/${authState.id}`}> {authState.username} </Link> 
                {authState.status && <button onClick={logout}> Logout </button>}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/createpost" element={<CreatePost/>}/>
            <Route path="/post/:id" element={<Post/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/changepassword/:id" element={<ChangePassword/>}/>
            <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
