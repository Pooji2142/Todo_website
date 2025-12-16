//create server
import express from "express";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import { userRoute } from "./APIs/UserAPI.js";
import cors from "cors";
import { UserModel } from "./models/UserModel.js";
import { verifyToken } from "./middlewares/verifyToken.js";
const app = express();
import dotenv from "dotenv";
dotenv.config();
//enable cors
app.use(cors({ origin: process.env.CLIENT_URL ,credentials:true}));
//add body parser middleware
app.use(express.json());
//add cookie parser middleware
app.use(cookieParser());

//if path starts with /user-api. forward req to UserROute
app.use("/user-api", userRoute);

//connect to db
async function connectDBAndStartServer() {
  try {
    //connect to database server
    await connect(process.env.MONGO_URI);
    console.log("DB connection success");
    //start HTTP server
    app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

  } catch (err) {
    console.log("Err in DB connection :", err);
  }
}

connectDBAndStartServer();

//page refresh route
app.get("/refresh",verifyToken,async(req,res)=>{
  console.log("user is ",req.user)
  let userObj=await UserModel.findOne({email:req.user.email})
  res.status(200).json({message:"user",payload:userObj})
})
