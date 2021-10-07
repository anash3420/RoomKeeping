// -------------------------------------------------Imported Libraries--------------------------------------------------------------//
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
//Importing from modules
const auth = require("./middleware/auth");
const {
  Admin,
  RoomKeeper,
  Student,
  CleanRequest,
  Complaint,
  Suggestion,
  Feedback,
  validate,
} = require("./models/model");

const app = express();

// ---------------------------------------------------------Express Handling------------------------------------------------------- //
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static(path.resolve(__dirname, "../client/build")));

// -------------------------------------------------Connecting to database-----------------------------------------------------------//
mongoose
  .connect("mongodb://localhost:27017/roomkeeping", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// ------------------------------------------Setting Multer for file storage----------------------------------------------------- //
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'server/images/');
    },
    filename: function(req, file, cb) {   
        console.log(file);
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
  }

  const upload = multer({ storage: storage, fileFilter })
//----------------------------------------------------- Route API Requests--------------------------------------------------------- //

//------------------------------Authentication-----------------------------//
app.get("/api/auth/getuser", auth, async (req, res) => {
  const role = req.user.role;
  let user;
  if (role === "admin") {
    user = await Admin.findById(req.user._id).select("-password");
    if(user.profileimg.data !== undefined){
      const img = "data:image/"+ user.profileimg.contentType + ";base64," + user.profileimg.data.toString('base64')
      user = {
        name:user.name,
        _id:user._id,
        hostel:user.hostel,
        email:user.email,
        phone:user.phone,
        profileimg:img
      }
    }
  } else if (role === "roomkeeper") {
    user = await RoomKeeper.findById(req.user._id).select("-password");
    if(user.profileimg.data !== undefined){
      const img = "data:image/"+ user.profileimg.contentType + ";base64," + user.profileimg.data.toString('base64')
      user = {
        name:user.name,
        _id:user._id,
        hostel:user.hostel,
        email:user.email,
        phone:user.phone,
        ratings:user.ratings,
        complaints:user.complaints,
        profileimg:img
      }
    }
  } else if (role === "student") {
    user = await Student.findById(req.user._id).select("-password");
    if(user.profileimg.data !== undefined){
      const img = "data:image/"+ user.profileimg.contentType + ";base64," + user.profileimg.data.toString('base64')
      user = {
        name:user.name,
        _id:user._id,
        hostel:user.hostel,
        email:user.email,
        phone:user.phone,
        floor:user.floor,
        room:user.room,
        profileimg:img
      }
    }
  } else {
    res.status(404).send("User not found!");
  }
  res.status(200).send({ user, role });
});

//---------------------------Registering Admin-------------------------//
app.post("/api/auth/register", async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) {
    console.log(error);
    return res.status(204).send(error.details[0].message);
  }
  //find an existing user
  let user = await Admin.findOne({ email: req.body.email });
  if (user) return res.status(203).send("User already registered.");

  user = new Admin({
    name: req.body.fullname,
    password: req.body.password,
    email: req.body.email,
    hostel: req.body.hostel,
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    authToken: token,
  });
});

app.post("/api/auth/login", async (req, res) => {
  //validating data
  //find an existing user
  let user = {};
  let role = req.body.role;
  if (role === "admin") {
    user = await Admin.findOne({ email: req.body.email });
  } else if (role === "roomkeeper") {
    user = await RoomKeeper.findOne({ email: req.body.email });
  } else if (role === "student") {
    user = await Student.findOne({ email: req.body.email });
  } else {
    res.status(404).send({ message: "Please choose an appropriate Role!" });
  }

  if (user) {
    let hash = user.password;
    bcrypt.compare(req.body.password, hash, function (err, result) {
      if (err) {
        return err;
      } else {
        if (result) {
          const token = user.generateAuthToken();
          return res.status(200).send({ authToken: token });
        } else {
          res.status(203).send({ message: "Password is Incorrect" });
        }
      }
    });
  } else {
    res.status(204).send({ message: "No user found!" });
  }
});

//----------------------------Updating User------------------------------//
app.post("/api/updateUser", upload.single('profileimg'), async (req, res) => {
  console.log(req.body);
  const role = req.body.role;
  let user;
  if(req.body.changeimg){
    if(req.file) {
      console.log("Here");
      user = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        profileimg: {
          data: fs.readFileSync(path.join(__dirname +  '/images/' + req.file.filename)),
          contentType: req.file.mimetype
        }
      };
    } else {
      console.log("Image is Removed");
      user = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        profileimg: {
          data: undefined,
          contentType: undefined
        }
      };
    }
  }
  
  let updatedUser;
  if (role === "admin") {
    updatedUser = await Admin.findOneAndUpdate({ _id: req.body.id }, user, {
      new: true,
    });
  } else if (role === "roomkeeper") {
    updatedUser = await RoomKeeper.findOneAndUpdate(
      { _id: req.body.id },
      user,
      {
        new: true,
      }
    );
  } else if (role === "student") {
    updatedUser = await Student.findOneAndUpdate({ _id: req.body.id }, user, {
      new: true,
    });
  } else {
    res.status(404).send("Select an appropriate Role");
  }
  if (req.file){
    fs.unlink(path.join(__dirname +  '/images/' + req.file.filename), (err) => {
      if (err) {
          console.error(err)
      }
      else {
        console.log("Deleted Successfully!");
      }
    })
    const img = "data:image/"+ updatedUser.profileimg.contentType + ";base64," + updatedUser.profileimg.data.toString('base64');
    res.status(200).send({
    _id: updatedUser._id,
    name: updatedUser.name,
    hostel: updatedUser.hostel,
    email: updatedUser.email,
    phone: updatedUser.phone,
    profileimg: img
  });
  }else {
    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      hostel: updatedUser.hostel,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
  }
});
//----------------------------Updating Password------------------------------//
app.post("/api/updatePassword", async (req, res) => {
  const body = req.body;
  if (body.password !== body.cPassword) {
    res.status(203).send("Password and Confirm Password didn't match");
  } else {
    const newPassword = await bcrypt.hash(body.password, 10);
    if (body.role === "admin") {
      updatedUser = await Admin.findOneAndUpdate(
        { _id: req.body._id },
        { password: newPassword },
        {
          new: true,
        }
      );
    } else if (body.role === "roomkeeper") {
      updatedUser = await RoomKeeper.findOneAndUpdate(
        { _id: req.body._id },
        { password: newPassword },
        {
          new: true,
        }
      );
    } else if (body.role === "student") {
      updatedUser = await Student.findOneAndUpdate(
        { _id: req.body._id },
        { password: newPassword },
        {
          new: true,
        }
      );
    } else {
      res.status(404).send("Select an appropriate Role");
    }
    res.status(200).send("Password Successfully Updated!");
  }
});

//---------------------------Registering RoomKeeper-------------------------//
app.post("/api/register/RoomKeeper", async (req, res) => {
  if (req.body.role === "admin") {
    const { error } = validate({fullname:req.body.fullname,email:req.body.email,password:req.body.password,hostel:req.body.hostel});
    if (error) {
      console.log(error);
      return res.status(203).send(error.details[0].message);
    }
    //find an existing user
    let user = await RoomKeeper.findOne({ email: req.body.email });
    if (user) return res.status(203).send("RoomKeeper already registered.");

    user = new RoomKeeper({
      name: req.body.fullname,
      password: req.body.password,
      email: req.body.email,
      hostel: req.body.hostel,
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    res.status(200).send("Successfully Registered!");
  } else {
    res.status(203).send("You are not authorized!");
  }
});

//---------------------------Registering RoomKeeper-------------------------//
app.post("/api/register/Student", async (req, res) => {
  console.log(req.body);
  if (req.body.role === "admin") {
    const { error } = validate({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      hostel: req.body.hostel,
    });
    if (error) {
      console.log(error);
      return res.status(203).send(error.details[0].message);
    } else if (!req.body.room && !req.body.floor) {
      return res.status(203).send("Room Details Required");
    }
    //find an existing user
    let user = await Student.findOne({ email: req.body.email });
    if (user) return res.status(203).send("Student already registered.");

    // let Room = await Student.findOne({ room: req.body.email });
    // if (user) return res.status(203).send("Student already registered.");
    user = new Student({
      name: req.body.fullname,
      password: req.body.password,
      email: req.body.email,
      hostel: req.body.hostel,
      room: req.body.room,
      floor: req.body.floor,
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    res.status(200).send("Successfully Registered!");
  } else {
    res.status(203).send("You are not authorized!");
  }
});

// All other GET requests not handled before will return our React app
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

//----------------------------------------------------Express Server------------------------------------------------------------------//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
