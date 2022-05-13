const User = require("../models/userSchema");
const validate = require("../config/validator");
const bcrypt = require("bcryptjs/dist/bcrypt");
const {generateToken }=require("../utils/generateToken")


//create a new user
const createUser = async(req, res)=>{
    const {username, email, password} = req.body;
    const valid = await validate ({username, email, password});

    if(valid) {
        const hashedPassword = await bcrypt.hash(valid.password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
         if (user) {
            res.status(201).json({
              username:user.username,
              email:user.email,
              id:user._id,
              token:generateToken(user._id)
            });
         }

        
    }else {
        res.status(404).json({
            message: "Invalid data",
        });
    }
};

//auth a user
async function loginUser(req, res) {
    try {
        const { email, password }= req.body
        const user = await User.findOne({ email })

        if(user){
            const isMatch = await bcrypt.compare(password, user.password)
            if(isMatch) {
                res.status(200).json({
                    username: user.username,
                    enail: user.email,
                    id: user._id,
                    token: generateToken(user._id),
                });
            }else{
                res.status(401).json({
                    message: "Invalid password"
                });
            }
        }else{
            res.status(401).json({
                message: "Invalid email",
            });
        }

    }catch{
        res.status(400).json({
            message: "User not found",
        });
    }
}


module.exports={createUser, loginUser}