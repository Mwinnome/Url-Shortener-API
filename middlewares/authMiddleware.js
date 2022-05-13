const jwt=require("jsonwebtoken")
const user = require("../models/userSchema")

exports.protect =async function(req, res, next) {
     let token;
     if (req.headers.authorization && req.headers.authorization.startswith("Bearer")){
         try{
         token = req.headers.authorization.split(" ")[1];
         const decode = jwt.verify(token, process.env.JWT_SECRET);
         req.user = await user.findById(decode.id);
         next();
        }catch (err) {
            res.status(401).json({
                message: "Invalid token"
            });
        }
    }
     
     if (!token){
         res.status(401).json({
             message: "You are not authorized"
         });
        }

    };

        //is admin middleware
        exports.admin = async function (req, res, next) {
            if (req.user && req.user.isAdmin) {
                next();
            }else{
                res.status(401).json({
                    message: "You are not an authorized admin"
                });
            }
        }