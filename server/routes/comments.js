const express = require("express");
const router = express.Router();
const {comments} = require("../models");
const {validateToken} = require("../middlewares/authenticate")

// return all comments for post
// called from Post
// receives post id
// reutrns comments associated with passed post id
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const commentsObj = await comments.findAll({ where:{ postId: postId } });
    res.json(commentsObj);
});

// create comment
// called from Post
// receives text, post id, id, username
// returns comment
router.post("/", validateToken, async (req, res) => {
    const comment = req.body;
    const username = req.user.username;
    comment.userId = req.user.id;
    comment.username = username;
    await comments.create(comment);
    res.json(comment);
  });

// delete comment
// called from Post
// receives comment id
// returns "Deleted"
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  await comments.destroy({where: {
    id: commentId
  }});
  res.json("Deleted")
});


module.exports = router;