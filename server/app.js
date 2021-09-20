// -------------------------------------------------Imported Libraries-----------------------------------------------------------------//
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

// ---------------------------------------------------------Express Handling---------------------------------------------------------- //
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

//----------------------------------------------------- Route API Requests------------------------------------------------------------- //

//------------------------------Authentication-----------------------------//
app.get("/api/auth/getuser", auth, async (req, res) => {
  const role = req.user.role;
  let user;
  if (role === "admin") {
    user = await Admin.findById(req.user._id).select("-password");
  } else if (role === "roomkeeper") {
    user = await RoomKeeper.findById(req.user._id).select("-password");
  } else if (role === "student") {
    user = await Student.findById(req.user._id).select("-password");
  } else {
    res.status(404).send("User not found!");
  }
  res.status(200).send({ user, role });
});
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
    user = await Roomkeeper.findOne({ email: req.body.email });
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
app.post("/api/updateUser", async (req, res) => {
  const role = req.body.role;
  const user = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  };
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
  res
    .status(200)
    .send({
      _id: updatedUser._id,
      name: updatedUser.name,
      hostel: updatedUser.hostel,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
});
//----------------------------Updating Password------------------------------//
app.post('/api/updatePassword', async (req,res)=> {
  const body = req.body;
  if(body.password !== body.cPassword){
    res.status(203).send("Password and Confirm Password didn't match");
  }else {
    const newPassword = await bcrypt.hash(body.password, 10);
    if (body.role === "admin") {
      updatedUser = await Admin.findOneAndUpdate({ _id: req.body._id }, {password: newPassword}, {
        new: true,
      });
    } else if (body.role === "roomkeeper") {
      updatedUser = await RoomKeeper.findOneAndUpdate(
        { _id: req.body._id },
        {password: newPassword},
        {
          new: true,
        }
      );
    } else if (body.role === "student") {
      updatedUser = await Student.findOneAndUpdate({ _id: req.body._id }, {password: newPassword}, {
        new: true,
      });
    } else {
      res.status(404).send("Select an appropriate Role");
    }
    res.status(200).send("Password Successfully Updated!");
  }
})

// All other GET requests not handled before will return our React app
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

//----------------------------------------------------Express Server------------------------------------------------------------------//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
