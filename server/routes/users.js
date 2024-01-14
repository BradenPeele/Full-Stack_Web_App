const express = require("express");
const router = express.Router();
const {users} = require("../models");
const bcrypt = require("bcrypt");
const {sign} = require("jsonwebtoken");
const {validateToken} = require("../middlewares/authenticate")


// register
// called from Register
// receives {username, id}
// returns "Registered" or error
router.post("/", async (req, res) => {
    const { username, password } = req.body;
    const user = await users.findOne({ where: { username: username } });
    if(!user) {
        bcrypt.hash(password, 10).then((hash) => {
            users.create({
                username: username,
                password: hash
            });
            res.json("Registered");
        });
    } else {
        res.json({ error: "Username already exists" });
    }
});


// login
// called from Login, Register
// receives {username, password}
// returns {token(signed), username, id} or error
router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await users.findOne({ where: { username: username } });
    if(!user) {
        res.json({ error: "User doesn't exist" });
    } else {
        bcrypt.compare(password, user.password).then(async (match) => {
            if (!match) {
                res.json({ error: "Username/password combination incorrect" });
            } else {
                const access_token = sign({ username: user.username, id: user.id }, "secret");
                res.json({token: access_token, username: username, id: user.id});
            };
        });
    };
});


router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

// get username
// called from Profile
// receives id
// returns username
router.get("/username/:id", async (req, res) => {
    const id = req.params.id;
    const basicInfo = await users.findByPk(id, {
        attributes: { exclude: ["password"] },
    });
    res.json(basicInfo);
  });
  

// change password
// called from CHangePassword
// receives username, oldpassword, newpassword
// returns "Password changed" or error
router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await users.findOne({ where: { username: req.user.username } });

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) {
            res.json({ error: "Wrong Password Entered!" });
        } else {
            bcrypt.hash(newPassword, 10).then((hash) => {
                users.update(
                    { password: hash },
                    { where: { username: req.user.username } }
                );
                res.json("Password changed");
            });
        }
    });
});


module.exports = router;