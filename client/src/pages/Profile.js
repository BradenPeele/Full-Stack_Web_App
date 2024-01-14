import React, {useEffect, useState, useContext} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";

/*
    displays all posts by the user
    allows profile owner to change password
*/
function Profile() {

    let {id} = useParams();
    let navigate = useNavigate();
    const {authState} = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);


    // get username and all posts by user
    useEffect(() => {
        axios.get(`http://localhost:3001/users/username/${id}`).then((response) => {
        setUsername(response.data.username);
        });
        
        axios.get(`http://localhost:3001/posts/userId/${id}`).then((response) => {
        setListOfPosts(response.data);
        });
    }, []);

    return (
        <div>
            <div className="info">
                <h1> Username: {username} </h1>
                {authState.username === username && (<button onClick={() => navigate(`/changepassword/${id}`)}> Change Password </button>)}
            </div>
            <div>
                {listOfPosts.map((value, key) => {
                    return (
                        <div key={key} className="post">
                            <div className="title"> {value.title} </div>
                            <div
                                className="body"
                                onClick={() => {
                                    navigate(`/post/${value.id}`);
                                }}
                            >
                                {value.text}
                            </div>
                            <div className="footer">
                                <div className="username">{value.username}</div>
                                <div className="buttons">
                                <label> {value.likes.length}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Profile;