import React, {useContext} from "react";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

/*
    displays all posts made
    allows users to like posts
*/
function Home() {

    let navigate = useNavigate();
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    // navigate to login if not logged in
    useEffect(() => {
        if(!localStorage.getItem("access_token")) {
            navigate("/login");
        } else {
            // display all posts
            axios.get("http://localhost:3001/posts", {
                headers: { access_token: localStorage.getItem("access_token") },
            }).then((response) => {
                setListOfPosts(response.data.listOfPosts);
                setLikedPosts(response.data.likedPosts.map((like) => {return like.postId}));
            });
        }
    }, []);

    const like_post = (postId) => {
        axios.post("http://localhost:3001/likes", 
            {postId: postId}, 
            {headers: {access_token: localStorage.getItem("access_token")}
        }
        ).then((response) => {
            setListOfPosts(listOfPosts.map((post) => {
                // modify post to add a dummy like to like array to force update immediately
                if(post.id === postId) {
                    if(response.data.liked) {
                        return {...post, likes: [...post.likes, 0]};
                    } else {
                        // pop last element of likes list
                        const likesArray = post.likes;
                        likesArray.pop();
                        return {...post, likes: likesArray};
                    }
                } else {
                    return post;
                }
            }))
            if(likedPosts.includes(postId)) {
                setLikedPosts(likedPosts.filter((id) => {
                    return id != postId})
                );
            } else {
                setLikedPosts([...likedPosts, postId]);
            }
        });
    };

    return (
        <div> {listOfPosts.map((value, key) => {
            return (
                <div key={key} className="post"> 
                    <div className="title">{value.title} </div>
                    <div className="body" 
                        onClick={() => {navigate(`/post/${value.id}`)}}
                    >{value.text} </div>
                    <div className="footer">
                        <div className="username">
                            <Link to={`/profile/${value.userId}`}> {value.username} </Link>
                        </div>
                        <div className="buttons">
                            <ThumbUpAltIcon 
                                onClick={() => {
                                    like_post(value.id);
                                }}
                                className={likedPosts.includes(value.id) ? "unlike_button" : "like_button"}
                            />
                            <label> {value.likes.length} </label>
                        </div>
                    </div>
                </div>
            );
        })} </div>
    )
}

export default Home;
