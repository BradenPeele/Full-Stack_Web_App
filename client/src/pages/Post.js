import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from "../helpers/AuthContext";

/*
    displays individual post and associated comments
    accessed by clicking post on home page or profile page
    allows post owner to add, remove and edit posts
    allows users to add comments 
*/
function Post() {

    let navigate = useNavigate();
    let {id} = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const {authState} = useContext(AuthContext);

    // gets post and associated comments
    useEffect(() => {
        axios.get(`http://localhost:3001/posts/postId/${id}`).then((response) => {
            setPostObject(response.data);
        });
        
        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []);

    const add_comment = () => {
        axios.post("http://localhost:3001/comments",
            {text: newComment, postId: id},
            {headers: {access_token: localStorage.getItem("access_token")}}
        ).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            } else {
                // add comment others and reload to update
                const commentToAdd = {text: newComment, username: response.data.username};
                setComments([...comments, commentToAdd]);
                setNewComment("");
                window.location.reload();
            }
        });
    };

    const delete_comment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`, 
            {headers: {access_token: localStorage.getItem("access_token")}
        }).then(() => {
            // update
             setComments(comments.filter((val) => {
                 return val.id != id;
             }));
        });
    };

    const delete_post = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`, {
            headers: {access_token: localStorage.getItem("access_token")}
        }).then(() => {
            navigate("/");
        });
    };

    const edit_post = (option) => {
        if(option === "title") {
            let newTitle = prompt("New Title:");
            if(newTitle != null) {
                axios.put("http://localhost:3001/posts/title",
                    {newTitle: newTitle, id: id},
                    {headers: { access_token: localStorage.getItem("access_token")}}
                );
                // update
                setPostObject({ ...postObject, title: newTitle });
            }
        } else {
            let newText = prompt("New Text:");
            if(newText != null) {
                axios.put("http://localhost:3001/posts/text",
                    {newText: newText, id: id},
                    {headers: {access_token: localStorage.getItem("access_token")}}
                );    
                // update
                setPostObject({ ...postObject, text: newText });
            }
        }
    };

    return (
        <div className="post_page"> 
            <div className="left">
                <div className="post" id="individual">
                    <div className="title" 
                        onClick={() => {
                            if(authState.username === postObject.username) {
                                edit_post("title");
                            }
                        }}> 
                        {postObject.title} 
                    </div>
                    <div className="body" 
                        onClick={() => {
                            if(authState.username === postObject.username) {
                                edit_post("body");
                            }
                        }}> 
                        {postObject.text}
                    </div>
                    <div className="footer"> 
                        {postObject.username} {authState.username === postObject.username && (
                            <button onClick={() => {delete_post(postObject.id)}}> Delete Post </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="add_comment_container">
                    <input type="text" placeholder="Comment..." value={newComment} onChange={(event) => {setNewComment(event.target.value)}}/>
                    <button onClick={add_comment}> Add Comment</button>
                </div>
                <div className="comment_list">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment"> 
                                {comment.text}  
                                <label> Username: {authState.username} </label>
                                {authState.username === comment.username && <button onClick={() => {delete_comment(comment.id)}}> X </button>}
                            </div>  
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;