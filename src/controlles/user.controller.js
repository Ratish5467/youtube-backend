import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import {ApiResponse} from ".././utils/ApiResponse.js"; 


const generateAccessAndRefreshToken=async function(userid){
    try {
      const user=User.findById(userid);
      const accessToken=generateAccessToken();
      const refreshToken=generateRefreshToken();

      user.refreshToken=refreshToken
      await user.save({
        validateBeforeSave:false
      })

    } catch (error) {
      throw new ApiError(500,"Something went wrong while generating refresh and access token");
    }

    return {accessToken,refreshToken};
}


const registeruser=asyncHandler( async (req,res)=>{
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res



   const {fullName,userName,email,password,refreshToken}=req.body;
   if(
    [fullName,userName,email,password].some((fields)=>fields?.trim()==="")
   ){
        throw new ApiError(400,"All the fields are required!!!")
   }
   if(!email.includes('@')){
        throw new ApiError(403,"Email is invalid")
   }
   const existedUser= await User.findOne({
    $or:[{userName},{email}]
   })
   if(existedUser) {throw new ApiError(409,"User is already existed");}

  const avatarLocalPath=req.files.avatar[0].path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
      coverImageLocalPath=req.files.coverImage[0].path;
  }

  if(!avatarLocalPath) {
    throw new ApiError(400,"Avatar is required")
  } 
  const avatar =await uploadOnCloundinary(avatarLocalPath);
  const coverImage = await uploadOnCloundinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiError(400,"Avatar is required")
  }

  const user=await User.create({
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url||"",
      email,
      password,
      userName:userName.toLowerCase()
  })
  const createduser=await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if(!createduser){
    throw new ApiError(500,"Something went wrong while registering a user")
  }
  return res.status(201).json(
    new ApiResponse(200,createduser,"User Registered Succesfully")
  )
})

const loginuser=asyncHandler(async (req,res)=>{
  const {username,email,password}=req.body;
  if(!username || email){
     throw new ApiError(400,"username or email is required");
  }
  
  const user=User.findOne({
    $or:[{username},{email}]
  })

  if(!user){
    throw new ApiError(400,"User doesn't exists");
  }

  const isPasswordValid=await user.isPasswordCorrect(password);

  if(!isPasswordValid){
      throw new ApiError(400,"Password is incorrrect")
  }

  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

  const loggedInUser=await User.findById(user._id).select( "-password -refreshToken");

  const options={
     httpOnly:true,
     secure:true
  }

  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"Logged In Succesfully")
  )
})

const logOutUser=asyncHandler(async (req,res)=>{
   await User.findOneAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
   )
    const options={
     httpOnly:true,
     secure:true
  }
  return res.status(200)
  .clearCookie("accessToken")
  .clearCookie("refreshToken")
  .json(
    new ApiResponse(200,{},"User logout succesfully")
  )
})
export default {
  registeruser,
  loginuser,
logOutUser};