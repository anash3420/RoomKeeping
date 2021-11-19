// -------------------------------------------------Imported Libraries--------------------------------------------------------------//
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const Joi = require("joi");
const Crypto = require("crypto");
const hbs = require("nodemailer-express-handlebars");
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
  Token,
  validate,
} = require("./models/model");
const e = require("express");

const app = express();

// ---------------------------------------------------------Express Handling------------------------------------------------------- //
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static(path.resolve(__dirname, "../client/build")));

// -------------------------------------------------Connecting to database----------------------------------------------------------//
mongoose
  .connect(`${process.env.MONGO_URL}`, {
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
  destination: function (req, file, cb) {
    cb(null, "server/images/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter });

//--------------------------------------------------NodeMailer For Sending E-Mails--------------------------------------------------//

const sendEmail = async (email, subject, type, payload) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    transporter.use(
      "compile",
      hbs({ viewEngine: "express-handlebars", viewPath: "./server/html/" })
    );
    if (type === "forgot-password") {
      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        template: "main",
        context: {
          link: payload.link,
        },
        attachments: [
          {
            filename: "animated_header.gif",
            path: __dirname + "/html/images/animated_header.gif",
            cid: "animated_header",
          },
          {
            filename: "bottom_img.png",
            path: __dirname + "/html/images/bottom_img.png",
            cid: "bottom_img",
          },
          {
            filename: "body_background_2.png",
            path: __dirname + "/html/images/body_background_2.png",
            cid: "body_background_2",
          },
          {
            filename: "logo-dark.png",
            path: __dirname + "/html/images/logo-dark.png",
            cid: "logo",
          },
          {
            filename: "instagram2x.png",
            path: __dirname + "/html/images/instagram2x.png",
            cid: "insta",
          },
          {
            filename: "twitter2x.png",
            path: __dirname + "/html/images/twitter2x.png",
            cid: "twitter",
          },
        ],
      });
    }

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

//----------------------------------------------------- Route API Requests--------------------------------------------------------- //

//------------------------------Authentication-----------------------------//
app.get("/api/auth/getuser", auth, async (req, res) => {
  const role = req.user.role;
  let user;
  if (role === "admin") {
    user = await Admin.findById(req.user._id).select("-password");
    if (user.profileimg.data !== undefined) {
      const img =
        "data:image/" +
        user.profileimg.contentType +
        ";base64," +
        user.profileimg.data.toString("base64");
      user = {
        name: user.name,
        _id: user._id,
        hostel: user.hostel,
        email: user.email,
        phone: user.phone,
        profileimg: img,
      };
    }
  } else if (role === "roomkeeper") {
    user = await RoomKeeper.findById(req.user._id).select("-password");
    let avg;
    if (user.ratings.length > 1) {
      avg =
        Math.round(
          (user.ratings.reduce((a, b) => a + b) / user.ratings.length) * 10
        ) / 10;
    } else if (user.ratings.length === 1) {
      avg = user.ratings[0];
    } else {
      avg = 0;
    }
    if (user.profileimg.data !== undefined) {
      const img =
        "data:image/" +
        user.profileimg.contentType +
        ";base64," +
        user.profileimg.data.toString("base64");
      user = {
        name: user.name,
        _id: user._id,
        hostel: user.hostel,
        email: user.email,
        phone: user.phone,
        ratings: { avg, count: user.ratings.length },
        complaints: user.complaints,
        profileimg: img,
      };
    }
  } else if (role === "student") {
    user = await Student.findById(req.user._id).select("-password");
    if (user.profileimg.data !== undefined) {
      const img =
        "data:image/" +
        user.profileimg.contentType +
        ";base64," +
        user.profileimg.data.toString("base64");
      user = {
        name: user.name,
        _id: user._id,
        hostel: user.hostel,
        email: user.email,
        phone: user.phone,
        floor: user.floor,
        room: user.room,
        profileimg: img,
      };
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

  let hostel = await Admin.findOne({ hostel: req.body.hostel });
  if (hostel) return res.status(203).send("Hostel Name is already registered.");

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

//---------------------------Logging In-------------------------//
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

//---------------------------Forgot Password-------------------------//
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      role: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const role = req.body.role;
    let user;
    if (role === "admin") {
      user = await Admin.findOne({ email: req.body.email });
    } else if (role === "student") {
      user = await Student.findOne({ email: req.body.email });
    } else if (role === "roomkeeper") {
      user = await RoomKeeper.findOne({ email: req.body.email });
    } else {
      res.status(400).send("Please Select a Valid Role!");
    }

    if (!user)
      return res.status(400).send("User with given email doesn't exist!");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: Crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/auth/reset-password/${role}/${user._id}/${token.token}`;
    await sendEmail(
      user.email,
      "Your RoomKeeping Account Password reset",
      "forgot-password",
      { link: link }
    );

    res.status(200).send("Reset Password Link Sent to given E-mail");
  } catch (error) {
    res.status(400).send("An error occured");
    console.log(error);
  }
});

//---------------------------Reset Password-------------------------//
app.post("/api/auth/reset-password/:role/:userid/:token", async (req, res) => {
  const role = req.params.role;
  try {
    const schema = Joi.object({ password: Joi.string().min(3).required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(203).send(error.details[0].message);

    let user;
    if (role === "admin") {
      user = await Admin.findById(req.params.userid);
    } else if (role === "roomkeeper") {
      user = await RoomKeeper.findById(req.params.userid);
    } else if (role === "student") {
      user = await Student.findById(req.params.userid);
    } else {
      res.status(203).send("Please Select a Valid Role");
    }
    if (!user) return res.status(203).send("Invalid Link or Expired!");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(203).send("Invalid Link or Expired!");
    const newPassword = await bcrypt.hash(req.body.password, 10);
    user.password = newPassword;
    await user.save();
    await token.delete();

    res.status(200).send("Password reset sucessfully.");
  } catch (error) {
    res.status(400).send("An error occured");
    console.log(error);
  }
});
//----------------------------Updating User------------------------------//
app.post("/api/updateUser", upload.single("profileimg"), async (req, res) => {
  const role = req.body.role;
  const changeimg = req.body.changeimg;
  const isChange = changeimg === "true";
  let user = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  };
  if (req.file) {
    user = {
      ...user,
      profileimg: {
        data: fs.readFileSync(
          path.join(__dirname + "/images/" + req.file.filename)
        ),
        contentType: req.file.mimetype,
      },
    };
  }

  let updatedUser;
  if (role === "admin") {
    updatedUser = await Admin.findById(req.body.id);
  } else if (role === "roomkeeper") {
    updatedUser = await RoomKeeper.findById(req.body.id);
  } else if (role === "student") {
    updatedUser = await Student.findById(req.body.id);
  } else {
    res.status(404).send("Select an appropriate Role");
  }

  updatedUser.name = user.name;
  updatedUser.phone = user.phone;
  updatedUser.email = user.email;
  if (isChange) {
    if (req.file) {
      updatedUser.profileimg = user.profileimg;
      fs.unlink(
        path.join(__dirname + "/images/" + req.file.filename),
        (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Deleted Successfully!");
          }
        }
      );
    } else {
      updatedUser.profileimg = {};
    }
  } else {
    updatedUser.profileimg = updatedUser.profileimg;
  }
  await updatedUser.save();

  let userDetails;
  if (role === "admin") {
    userDetails = await Admin.findById(req.body.id);
  } else if (role === "roomkeeper") {
    userDetails = await RoomKeeper.findById(req.body.id);
  } else if (role === "student") {
    userDetails = await Student.findById(req.body.id);
  }
  if (userDetails.profileimg.data !== undefined) {
    const img =
      "data:image/" +
      userDetails.profileimg.contentType +
      ";base64," +
      userDetails.profileimg.data.toString("base64");
    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      hostel: updatedUser.hostel,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profileimg: img,
    });
  } else {
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

//------------------------------------------------------Managing Users-------------------------------------------------------------//

//---------------------------Registering RoomKeeper-------------------------//
app.post("/api/register/RoomKeeper", async (req, res) => {
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

//---------------------------Registering Student-------------------------//
app.post("/api/register/Student", async (req, res) => {
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

//--------------------------Delete Users--------------------------------//
app.post("/api/deleteAllUsers", async (req, res) => {
  const hostel = req.query.hostel;
  const role = req.query.role;
  if (role === "roomkeeper") {
    
    await RoomKeeper.deleteMany({ hostel });
    await CleanRequest.deleteMany({ hostel });
    await Feedback.deleteMany({ hostel });
    await Complaint.deleteMany({ hostel });
    await Suggestion.deleteMany({ hostel });
    res.status(200).send("Successfully Deleted All RoomKeepers!");
  } else if (role === "student") {
    
    await Student.deleteMany({ hostel });
    await CleanRequest.deleteMany({ hostel });
    await Feedback.deleteMany({ hostel });
    await Complaint.deleteMany({ hostel });
    await Suggestion.deleteMany({ hostel });
    res.status(200).send("Successfully Deleted All Students!");

  } else {
    res.status(204).send("Please Select a Valid Role");
  }
});

app.post("/api/deleteUsers", async (req, res) => {
  const role = req.query.role;
  const hostel = req.query.hostel;
  const email = req.body.email;
  if (email) {
    if (role === "student") {
      const student = await Student.findOne({ email });
      await Student.deleteOne({ email });
      await CleanRequest.deleteMany({ studentId: student._id });
      await Feedback.deleteMany({ studentId: student._id });
      await Complaint.deleteMany({ studentId: student._id });
      await Suggestion.deleteMany({ studentId: student._id });

    } else if (role === "roomkeeper") {
      const roomKeeper = await RoomKeeper.findOne({ email });
      await RoomKeeper.deleteOne({ email });
      await CleanRequest.deleteMany({ roomkeeper: roomKeeper.name, hostel });
      await Feedback.deleteMany({ roomKeeperId: roomKeeper._id });
      await Complaint.deleteMany({ roomKeeperId: roomKeeper._id });
      await Suggestion.deleteMany({ roomKeeperId: roomKeeper._id });

    } else {
      res.status(400).send("Please Select a Valid Role!");
    }
  } else {
    if (role === "student") {
      const remStudents = req.body.data;
      const students = await Student.find({ hostel, email: {$in: remStudents} }).select("-password");

      const studentId = students.map((student) => student._id);
      await Student.deleteMany({ _id: {$in: studentId} });
      await CleanRequest.deleteMany({ studentId: {$in: studentId} });
      await Feedback.deleteMany({ studentId: {$in: studentId} });
      await Complaint.deleteMany({ studentId: {$in: studentId} });
      await Suggestion.deleteMany({ studentId: {$in: studentId} });

    } else if (role === "roomkeeper") {
      const remRoomKeepers = req.body.data;
      const roomKeepers = await RoomKeeper.find({ hostel, email: {$in: remRoomKeepers} }).select("-password");
      // console.log(roomKeepers);
      const roomKeeperId = roomKeepers.map((roomKeeper) => {
        return roomKeeper._id;
      });
      const roomKeeperName = roomKeepers.map((roomKeeper) => {
        return roomKeeper.name;
      });

      await RoomKeeper.deleteMany({ hostel, email: { $in: remRoomKeepers } });
      await CleanRequest.deleteMany({ hostel, roomkeeper: { $in: roomKeeperName } });
      await Feedback.deleteMany({ roomKeeperId: { $in: roomKeeperId } });
      await Complaint.deleteMany({ roomKeeperId: { $in: roomKeeperId } });
      await Suggestion.deleteMany({ roomKeeperId: { $in: roomKeeperId } });

    } else {
      res.status(400).send("Select a Valid Role to Delete!");
    }
  }
  res.status(200).send("Successfully Deleted.");
});

//--------------------------Users List---------------------------//
app.get("/api/users", async (req, res) => {
  console.log( req.query);
  const role = req.query.role;
  const hostel = req.query.hostel;
  if (role === "student") {
    const students = await Student.find({ hostel }).select("-password");
    const studentDetails = students.map((student) => {
      let img = "";
      if (student.profileimg.data !== undefined) {
        img =
          "data:image/" +
          student.profileimg.contentType +
          ";base64," +
          student.profileimg.data.toString("base64");
      }
      return {
        name: student.name,
        email: student.email,
        room: student.room,
        floor: student.floor,
        phone: student.phone,
        profileimg: img,
        _id: student._id,
      };
    });
    res.status(200).send(studentDetails);
  } else if (role === "roomkeeper") {
    const roomKeepers = await RoomKeeper.find({ hostel }).select("-password");
    let avg = 0;
    const roomKeepersList = roomKeepers.map((roomKeeper) => {
      let img = "";
      if (roomKeeper.profileimg.data !== undefined) {
        img =
          "data:image/" +
          roomKeeper.profileimg.contentType +
          ";base64," +
          roomKeeper.profileimg.data.toString("base64");
      }
      if (roomKeeper.ratings.length > 1) {
        avg =
          Math.round(
            (roomKeeper.ratings.reduce((a, b) => a + b) /
              roomKeeper.ratings.length) *
              10
          ) / 10;
      } else if (roomKeeper.ratings.length === 1) {
        avg = roomKeeper.ratings[0];
      } else {
        avg = 0;
      }
      return {
        name: roomKeeper.name,
        email: roomKeeper.email,
        hostel: roomKeeper.hostel,
        phone: roomKeeper.phone,
        ratings: avg,
        count: roomKeeper.ratings.length,
        profileimg: img,
      };
    });
    res.status(200).send(roomKeepersList);
  }
  // console.log("Successflly fetched!");
});

//----------------------------------------------------User Dashboard---------------------------------------------------------------//

//--------------------------Admin Dashboard---------------------------//
app.get("/api/admin/dashboard", async (req, res) => {
  const hostel = req.query.hostel;
  const requests = await CleanRequest.find({
    hostel,
  });
  const dashRequests = requests.filter((value) => {
    return value.requestStatus === "Pending";
  });
  const reqLength = requests.filter((value) => {
    return value.requestStatus === "Completed";
  }).length;
  const students = await Student.find({ hostel }).select("__v");
  const studentsLength = students.length;
  const roomkeepers = await RoomKeeper.find({ hostel }).select("__v");
  const roomkeeperLength = roomkeepers.length;

  res.status(200).send({
    requests: reqLength,
    students: studentsLength,
    roomkeepers: roomkeeperLength,
    data: dashRequests,
  });
});

//--------------------------RoomKeeper Dashboard---------------------------//
app.get("/api/roomkeeper/dashboard", async (req, res) => {
  const id = req.query.roomKeeperId;
  const name = req.query.name;
  const hostel = req.query.hostel;
  const completedRequests = await CleanRequest.find({
    hostel,
    roomkeeper: name,
    requestStatus: "Completed",
  });
  const reqLength = completedRequests.length;
  const complaints = await Complaint.find({ roomKeeperId: id });
  const complaintsLength = complaints.length;
  const scheduledRequests = await CleanRequest.find({
    hostel,
    roomkeeper: name,
    requestStatus: "Alloted",
  }).select("-__v -requestStatus");
  const scheduledLength = scheduledRequests.length;
  const dashRequests = scheduledRequests.map(async (request) => {
    const studentData = await Student.findById(request.studentId).select(
      "email phone"
    );
    return {
      request,
      studentData,
    };
  });
  Promise.all(dashRequests).then((data) => {
    res.status(200).send({
      requests: reqLength,
      scheduled: scheduledLength,
      complaints: complaintsLength,
      data: data,
    });
  });
});

//--------------------------Student Dashboard---------------------------//
app.get("/api/student/dashboard", async (req, res) => {
  const id = req.query.id;

  let requests = await CleanRequest.find({ studentId: id }).select("-__v");
  const reqLength = requests.length;
  const completedRequests =requests.filter((value) => {
    return value.requestStatus === "Completed";
  }).length;
  const dashRequests = requests.filter((value) => {
    return (
      value.requestStatus === "Pending" || value.requestStatus === "Alloted"
    );
  });
  const pendingRequests = dashRequests.length;
  const finalArray = dashRequests.map(async (value) => {
    if (value.requestStatus === "Alloted") {
      const roomKeeperData = await RoomKeeper.findOne({
        name: value.roomkeeper,
        hostel: value.hostel,
      });
      let img = undefined;
      if (roomKeeperData.profileimg.contentType !== undefined) {
        img =
          "data:image/" +
          roomKeeperData.profileimg.contentType +
          ";base64," +
          roomKeeperData.profileimg.data.toString("base64");
      }
      const returnValue = {
        _id: value._id,
        studentId: value.studentId,
        requestStatus: value.requestStatus,
        roomkeeper: value.roomkeeper,
        date: value.date,
        time: value.time,
        profileimg: img,
        email: roomKeeperData.email,
        phone: roomKeeperData.phone,
      };
      return returnValue;
    } else {
      return value;
    }
  });
  Promise.all(finalArray).then(function (results) {
    res.status(200).send({
      requests: reqLength,
      scheduled: pendingRequests,
      completed: completedRequests,
      data: results,
    });
  });
});

//-----------------------------------------------Clean Requests--------------------------------------------------------------------//

//---------------------------Getting All Clean Request-------------------------//
app.get("/api/clean-requests/student", async (req, res) => {
  const studentId = req.query.id;
  const requests = await CleanRequest.find({ studentId });
  requests.reverse();
  const fetchedrequests = requests.map(async (value) => {
    if (value.requestStatus === "Completed") {
      const rating = await Feedback.findOne({
        requestId: value._id,
      }).select("rating");
      if (rating !== null) {
        value.rating = rating.rating;
      }
    }
    return value;
  });
  Promise.all(fetchedrequests).then((data) => {
    // console.log(data);
    res.status(200).send(data);
  });
});

app.get("/api/clean-requests/admin", async (req, res) => {
  const hostel = req.query.hostel;
  const requests = await CleanRequest.find({ hostel });
  requests.reverse();
  const fetchedrequests = requests.map(async (value) => {
    if (value.requestStatus === "Completed") {
      const rating = await Feedback.findOne({
        requestId: value._id,
      }).select("rating");
      if (rating !== null) {
        value.rating = rating.rating;
      }
    }
    return value;
  });
  Promise.all(fetchedrequests).then((data) => {
    // console.log(data);
    res.status(200).send(data);
  });
});

app.get("/api/clean-requests/roomkeeper", async (req, res) => {
  const roomkeeper = req.query.name;
  const hostel = req.query.hostel;
  const requests = await CleanRequest.find({ roomkeeper, hostel });
  requests.reverse();
  const fetchedrequests = requests.map(async (value) => {
    if (value.requestStatus === "Completed") {
      const rating = await Feedback.findOne({
        requestId: value._id,
      }).select("rating");
      if (rating !== null) {
        value.rating = rating.rating;
      }
    }
    return value;
  });
  Promise.all(fetchedrequests).then((data) => {
    // console.log(data);
    res.status(200).send(data);
  });
});

//---------------------------Creating Clean Request-------------------------//
app.post("/api/clean-request/create", async (req, res) => {
  const newRequest = req.body;
  let sum = 0;
  let flag = false;
  await CleanRequest.find(
    { studentId: newRequest.studentid, requestStatus: "Alloted" },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        result.forEach((request) => {
          sum++;
          if (request.date === newRequest.date) {
            flag = true;
          }
        });
      }
    }
  ).clone();
  await CleanRequest.find(
    { studentId: newRequest.studentid, requestStatus: "Pending" },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        result.forEach((request) => {
          sum++;
          if (request.date === newRequest.date) {
            flag = true;
          }
        });
        if (flag) {
          res.status(203).send("You have already requested for this date");
        } else {
          if (sum >= 3) {
            res.status(203).send("You Already have 3 Scheduled Requests.");
          } else {
            const request = new CleanRequest({
              studentId: newRequest.studentid,
              time: newRequest.time,
              date: newRequest.date,
              message: newRequest.message,
              requestStatus: "Pending",
              hostel: newRequest.hostel,
              room: newRequest.room,
              floor: newRequest.floor,
            });
            request.save();
            res.status(200).send("Clean Request Successfully Created.");
          }
        }
      }
    }
  ).clone();
});

//---------------------------Deleting Clean Request-------------------------//
app.post("/api/deleteRequest", async (req, res) => {
  const requestId = req.body.id;
  await CleanRequest.deleteOne({ _id: requestId }, (err, result) => {
    if (err) console.log(err);
    res.status(200).send("Successfully Deleted!");
  }).clone();
});

//---------------------------Rejecting Clean Request-------------------------//
app.post("/api/rejectRequest", async (req, res) => {
  const role = req.body.role;
  const requestId = req.body.id;
  const name = req.body.name;
  if (role === "admin") {
    const request = await CleanRequest.findOne({ _id: requestId });
    request.requestStatus = "Rejected";
    request.rejectReason = { message: req.body.message, role: role };
    request.save();
    res.status(200).send("Successfully Rejected!");
  } else if (role === "roomkeeper") {
    const request = await CleanRequest.findOne({ _id: requestId });
    request.requestStatus = "Pending";
    (request.roomkeeper = null),
      (request.rejectReason = {
        message: req.body.message,
        name: name,
        role: role,
      });
    request.save();
    res.status(200).send("Successfully Completed!");
  } else {
    res.status(400).send("You are not authorized!");
  }
});

//---------------------------Alloting Clean Request-------------------------//
app.get("/api/allotRequest", async (req, res) => {
  const hostel = req.query.hostel;
  const roomkeepers = await RoomKeeper.find({ hostel }).select("name");
  res.status(200).send(roomkeepers);
});

app.post("/api/allotRequest", async (req, res) => {
  const requestId = req.body.id;
  const request = await CleanRequest.findOne({ _id: requestId });
  request.requestStatus = "Alloted";
  request.roomkeeper = req.body.roomKeeper;
  request.save();
  res.status(200).send("Successfully Alloted!");
});

//---------------------------Getting RoomKeeper Schedule-------------------------//
app.get("/api/schedule", async (req, res) => {
  const roomkeeper = req.query.roomKeeper;
  const date = req.query.date;
  const requests = await CleanRequest.find({
    roomkeeper,
    date,
    requestStatus: "Alloted",
  }).select(
    "-__v -roomkeeper -requestStatus -date -hostel -studentId -message"
  );
  res.status(200).send(requests);
});

//---------------------------Completing Clean Request-------------------------//
app.post("/api/completeRequest", async (req, res) => {
  const requestId = req.body.id;
  const timeIn = req.body.timeIn;
  const timeOut = req.body.timeOut;
  const request = await CleanRequest.findOne({ _id: requestId });
  request.requestStatus = "Completed";
  request.timeIn = timeIn;
  request.timeOut = timeOut;
  request.save();
  res.status(200).send("Successfully Completed!");
});

//---------------------------------------------------------------FeedBack-----------------------------------------------------------//

//---------------------------Ratings-------------------------//
app.get("/api/ratings", async (req, res) => {
  const role = req.query.role;
  const hostel = req.query.hostel;
  const id = req.query.id;

  if (role === "admin") {
    const ratings = await Feedback.find({ hostel }).select("-_id -__v");
    const ratingData = ratings.map(async (rating) => {
      const roomKeeper = await RoomKeeper.findById(rating.roomKeeperId).select(
        "name profileimg"
      );
      const student = await Student.findById(rating.studentId).select(
        "name profileimg"
      );
      let studentImg = undefined;
      let img = undefined;
      if (roomKeeper.profileimg.contentType !== undefined) {
        img =
          "data:image/" +
          roomKeeper.profileimg.contentType +
          ";base64," +
          roomKeeper.profileimg.data.toString("base64");
      }
      if (student.profileimg.contentType !== undefined) {
        studentImg =
          "data:image/" +
          student.profileimg.contentType +
          ";base64," +
          student.profileimg.data.toString("base64");
      }
      const data = await CleanRequest.findById(rating.requestId).select(
        "-_id -__v"
      );
      return {
        name: roomKeeper.name,
        img,
        studentImg,
        student: student.name,
        rating: rating.rating,
        message: rating.message,
        date: data.date,
        room: data.room,
      };
    });
    Promise.all(ratingData)
      .then((data) => {
        // console.log(data);
        data.reverse();
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (role === "roomkeeper") {
    const ratings = await Feedback.find({ roomKeeperId: id }).select(
      "-_id -__v"
    );
    const ratingData = ratings.map(async (rating) => {
      const student = await Student.findById(rating.studentId).select(
        "name profileimg"
      );
      let img = undefined;
      if (student.profileimg.contentType !== undefined) {
        img =
          "data:image/" +
          student.profileimg.contentType +
          ";base64," +
          student.profileimg.data.toString("base64");
      }
      const data = await CleanRequest.findById(rating.requestId).select(
        "-_id -__v"
      );
      return {
        name: student.name,
        img,
        rating: rating.rating,
        message: rating.message,
        date: data.date,
        room: data.room,
      };
    });
    Promise.all(ratingData)
      .then((data) => {
        // console.log(data);
        data.reverse();
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).send("You are not authorized!");
  }
});

app.post("/api/ratings", async (req, res) => {
  // console.log(req.body);
  const rating = req.body.rating;
  const message = req.body.message;
  const _id = req.body.id;
  const suggestions = req.body.suggestions;
  const complains = req.body.complaints;

  const rateRequest = await CleanRequest.findById(_id);

  const roomKeeperId = await RoomKeeper.findOne({
    hostel: rateRequest.hostel,
    name: rateRequest.roomkeeper,
  });

  const feedback = new Feedback({
    studentId: rateRequest.studentId,
    roomKeeperId: roomKeeperId._id,
    requestId: rateRequest._id,
    hostel: rateRequest.hostel,
    message: message,
    rating: rating,
  });
  feedback.save();
  const updateRatings = await RoomKeeper.findOne({
    name: rateRequest.roomkeeper,
    hostel: rateRequest.hostel,
  }).select("ratings");
  updateRatings.ratings.push(rating);
  updateRatings.save();

  if (suggestions) {
    const feedbackId = await Feedback.findOne({
      studentId: rateRequest.studentId,
      roomKeeperId: roomKeeperId._id,
      requestId: rateRequest._id,
      hostel: rateRequest.hostel,
    }).select("_id");

    const suggestion = new Suggestion({
      studentId: rateRequest.studentId,
      roomKeeperId: roomKeeperId._id,
      hostel: rateRequest.hostel,
      feedbackId: feedbackId._id,
      details: {
        message: suggestions,
        requestId: _id,
      },
    });
    suggestion.save();
  }
  if (complains) {
    const feedbackId = await Feedback.findOne({
      studentId: rateRequest.studentId,
      requestId: rateRequest._id,
      hostel: rateRequest.hostel,
    }).select("_id");

    const complain = new Complaint({
      studentId: rateRequest.studentId,
      roomKeeperId: roomKeeperId._id,
      hostel: rateRequest.hostel,
      feedbackId: feedbackId._id,
      details: {
        message: complains,
        requestId: _id,
      },
    });
    complain.save();
  }
  res.status(200).send("Successfully Rated!");
});

//---------------------------Suggestions-------------------------//
app.get("/api/suggestions", async (req, res) => {
  const role = req.query.role;
  const hostel = req.query.hostel;
  const id = req.query.id;

  if (role === "admin") {
    const suggestions = await Suggestion.find({ hostel }).select("-_id -__v");
    const suggestionData = suggestions.map(async (suggestion) => {
      const roomKeeper = await RoomKeeper.findById(
        suggestion.roomKeeperId
      ).select("name profileimg");
      const student = await Student.findById(suggestion.studentId).select(
        "name profileimg"
      );
      let studentImg = undefined;
      let roomKeeperImg = undefined;
      if (roomKeeper.profileimg.contentType !== undefined) {
        roomKeeperImg =
          "data:image/" +
          roomKeeper.profileimg.contentType +
          ";base64," +
          roomKeeper.profileimg.data.toString("base64");
      }
      if (student.profileimg.contentType !== undefined) {
        studentImg =
          "data:image/" +
          student.profileimg.contentType +
          ";base64," +
          student.profileimg.data.toString("base64");
      }
      const data = await CleanRequest.findById(
        suggestion.details.requestId
      ).select("-_id -__v");
      return {
        name: roomKeeper.name,
        roomKeeperImg,
        studentImg,
        student: student.name,
        suggestion: suggestion.details.message,
        date: data.date,
        room: data.room,
      };
    });
    Promise.all(suggestionData)
      .then((data) => {
        // console.log(data);
        data.reverse();
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (role === "roomkeeper") {
    const suggestions = await Suggestion.find({ roomKeeperId: id }).select(
      "-_id -__v"
    );
    const suggestionData = suggestions.map(async (suggestion) => {
      const student = await Student.findById(suggestion.studentId).select(
        "name profileimg"
      );
      let studentImg = undefined;
      if (student.profileimg.contentType !== undefined) {
        studentImg =
          "data:image/" +
          student.profileimg.contentType +
          ";base64," +
          student.profileimg.data.toString("base64");
      }
      const data = await CleanRequest.findById(
        suggestion.details.requestId
      ).select("-_id -__v");
      return {
        name: student.name,
        studentImg,
        suggestion: suggestion.details.message,
        date: data.date,
        room: data.room,
      };
    });
    Promise.all(suggestionData)
      .then((data) => {
        // console.log(data);
        data.reverse();
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).send("You are not authorized!");
  }
});

app.get("/api/complaints", async (req, res) => {
  const role = req.query.role;
  const hostel = req.query.hostel;
  const id = req.query.id;
  
  if (role === "admin") {
    const complaints = await Complaint.find({ hostel }).select("-_id -__v");
    const complaintData = complaints.map(async (complaint) => {
      const roomKeeper = await RoomKeeper.findById(
        complaint.roomKeeperId
      ).select("name profileimg");
      const student = await Student.findById(complaint.studentId).select(
        "name profileimg"
      );
      let studentImg = undefined;
      let roomKeeperImg = undefined;
      if (roomKeeper.profileimg.contentType !== undefined) {
        roomKeeperImg =
          "data:image/" +
          roomKeeper.profileimg.contentType +
          ";base64," +
          roomKeeper.profileimg.data.toString("base64");
      }
      if (student.profileimg.contentType !== undefined) {
        studentImg =
          "data:image/" +
          student.profileimg.contentType +
          ";base64," +
          student.profileimg.data.toString("base64");
      }
      const data = await CleanRequest.findById(
        complaint.details.requestId
      ).select("-_id -__v");
      return {
        name: roomKeeper.name,
        roomKeeperImg,
        studentImg,
        student: student.name,
        complaint: complaint.details.message,
        date: data.date,
        room: data.room,
      };
    });
    Promise.all(complaintData)
      .then((data) => {
        // console.log(data);
        data.reverse();
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (role === "roomkeeper") {
    const complaints = await Complaint.find({ roomKeeperId: id }).select(
      "-_id -__v"
    );
    const complaintData = complaints.map(async (complaint) => {
      const student = await Student.findById(complaint.studentId).select(
        "name profileimg"
      );
      let studentImg = undefined;
      if (student.profileimg.contentType !== undefined) {
        studentImg =
          "data:image/" +
          student.profileimg.contentType +
          ";base64," +
          student.profileimg.data.toString("base64");
      }
      const data = await CleanRequest.findById(
        complaint.details.requestId
      ).select("-_id -__v");
      return {
        name: student.name,
        studentImg,
        complaint: complaint.details.message,
        date: data.date,
        room: data.room,
      };
    });
    Promise.all(complaintData)
      .then((data) => {
        // console.log(data);
        data.reverse();
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).send("You are not authorized!");
  }
});

// All other GET requests not handled before will return our React app
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

//----------------------------------------------------Express Server----------------------------------------------------------------//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
