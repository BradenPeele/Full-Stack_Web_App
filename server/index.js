const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());   
app.use(cors());           

const db = require("./models");

// Routers
const posts_router = require("./routes/posts");
app.use("/posts", posts_router);
const comments_router = require("./routes/comments");
app.use("/comments", comments_router);
const users_router = require("./routes/users");
app.use("/users", users_router);
const likes_router = require("./routes/likes");
app.use("/likes", likes_router);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server Started - running on port 3001");
    });
});