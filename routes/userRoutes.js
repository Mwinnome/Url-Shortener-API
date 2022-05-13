const {Router} = require ("express");
const { createUser, loginUser } = require("../controller/userController");


const router = Router();

router
.post("/register", createUser)
.post("/login", loginUser);

module.exports=router;