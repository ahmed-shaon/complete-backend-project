import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if user already exists: username, email
  //check for images, check for avatar
  //upload them to cloudinary, avatar save in cloudinary or not
  //create user object - create an entry in db
  //remove password and refresh token field from reponse
  //check for user creation
  //return response
  const { fullName, email, username, password } = req.body;

  // if (fullName === "") throw new ApiError(400, "fullname is required");
  //?Advanced syntax
  if (
    [fullName, email, username, password].some((value) => value?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) throw new ApiError(409, "user already exist!");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImamgeLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is requied");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImamgeLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file is required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowercase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //by default select all the fields, to remove some fields from the object we need to pass the string with prefix '-' before the field name like above

  if (!createdUser)
    throw new ApiError(500, "Something went while creating user");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

export { registerUser };
