const express = require('express');
const router = express.Router();
const {posts, likes} = require('../models');
const {validateToken} = require("../middlewares/authenticate");


// return all posts
// called from Home
// returns all posts, all likes on posts
router.get("/", validateToken, async (req, res) => {
    const listOfPosts = await posts.findAll({include: [likes]});
    const likedPosts = await likes.findAll({ where: { userId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});


// get post with passed id 
// called from Post
// receives post id
// returns post with pased id
router.get("/postId/:postId", async (req, res) => {
    const postId = req.params.postId;
    const post = await posts.findByPk(postId);
    res.json(post);
});


// get posts with user id
// called from Profile
// receives user id
// returns list of posts with pased user id
router.get("/userId/:userId", async (req, res) => {
    const userId = req.params.userId;
    const listOfPosts = await posts.findAll({where: {userId: userId}, include: [likes]});
    res.json(listOfPosts);
});

// create post 
// called from CreatePost
// receives title, text, username, id
// returns post
router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.userId = req.user.id;
    await posts.create(post);
    res.json(post);
});

// change title
// called from Post
// receives new title, id
// returns new title
router.put("/title", validateToken, async (req, res) => {
    const {newTitle, id} = req.body;
    await posts.update({ title: newTitle }, { where: { id: id } });
    res.json(newTitle);
});

  
// change text
// called from Post
// receives new text, id
// returns new text
router.put("/text", validateToken, async (req, res) => {
    const { newText, id } = req.body;
    await posts.update({ post_text: newText }, { where: { id: id } });
    res.json(newText);
});


// delete post
// called from Post
// receives post id
// returns "deleted"
router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    await posts.destroy({
        where: {
            id: postId,
        },
    });
    res.json("deleted");
});


module.exports = router;