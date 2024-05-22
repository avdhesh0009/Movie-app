const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { favourite } = require("../model/favouriteModel");

const userReg = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !password || !email) {
    res.status(400);
    throw new Error("Fill all field");
  }
  //check user exist or not
  const userExist = await User.findOne({ email });
  console.log(userExist);

  if (userExist) {
    res.status(400);
    throw new Error("User Already exists");
  }

  //hash password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});
const userLogin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
  res.send("UserLogin");
});

//crnt user
//protection middleware
const crntUser = asyncHandler(async (req, res) => {
  const { _id, name, email } = req.user;
  res.status(400).json({
    id: _id,
    name: name,
    email: email,
  });
});

const addFavourites = asyncHandler(async (req, res) => {
  
  console.log(req);

  //value of req.user is getting from Auth middleware

  const fav = await favourite.create({
    userId: req.body.params.userId,
    id:req.body.body.data.id,
    data:req.body.body.data
  });
  res.status(201).json(fav);
});

const removeFavourites = asyncHandler(async (req, res) => {
  const{params}=req;
  
   
 
   //value of req.user is getting from Auth middleware
 
   const fav = await favourite.remove({
    userId: req.body.params.userId,
    data:req.body.body.data
   });
   res.status(201).json(fav);
 });

const viewFavourites = asyncHandler(async (req, res) => {
  
  const Favourites = await favourite.find({});
  res.status(201).json(Favourites);
});

const check = async (req, res) => {
  console.log(req)
  const Favourite = await favourite.find({userId:req.query.userId,id:req.query.data.id});
  if (Favourite.length === 0) {
    res.status(201).json("false")
  }
  else
  res.status(201).json("true");
};

//generateToken
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}
module.exports = { userReg, userLogin, crntUser,addFavourites,viewFavourites ,check,removeFavourites};
