const express = require("express");
const router = express.Router();
const {likes} = require("../models");
const {validateToken} = require("../middlewares/authenticate");

// like/unlike
// called from Home
// receives post id
// returns true/false
router.post("/", validateToken, async (req, res) => {
    const {postId} = req.body;
    const userId = req.user.id;
  
    const found = await likes.findOne({
      where: { postId: postId, userId: userId },
    });

    if (!found) {
      await likes.create({ postId: postId, userId: userId });
      res.json({liked: true});
    } else {
      await likes.destroy({
        where: { postId: postId, userId: userId },
      });
      res.json({liked: false});
    }
  });
  
  module.exports = router;