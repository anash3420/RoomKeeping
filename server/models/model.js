require("dotenv").config();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const secret = process.env.SECRET;
//Creating Schema 

const adminSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    name: String,
    hostel: String,
    email: String,
    password: String,
    phone: Number
  })
  const roomkeeperSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    name: String,
    password: String,
    phone: Number,
    email: String,
    hostel: String,
    ratings:[],
    complaints:[],
  })
  const studentSchema = new mongoose.Schema({
    id:mongoose.ObjectId,
    name: String,
    password: String,
    phone: Number,
    email: String,
    hostel: String,
    floor: Number,
    roomNumber: Number
  })
  const cleanRequestSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    studentId: String,
    roomkeeperId: String,
    time: String,
    date: Date,
    timeIn: String,
    timeOut: String,
    requestStatus: Boolean
  })
  const complaintSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    feedbackId: String,
    studentId: String,
    details: {
      message: String,
      requestId: String,
    }
  })
  const suggestionSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    feedbackId: String,
    studentId: String,
    details: {
      message: String,
      requestId: String,
    }
  })
  const feedbackSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    studentId: String,
    requestId: String,
    rating:Number,
    message: String
  })

//custom method to generate authToken 
adminSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id, role: "admin" }, secret); 
    return token;
  }
  
  roomkeeperSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id, role:"roomkeeper" }, secret); 
    return token;
  }
  
  studentSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ _id: this._id, role:"student" }, secret); 
    return token;
  }
  
  //Creating Collection
  
  const Admin = new mongoose.model('Admin', adminSchema);
  const RoomKeeper = new mongoose.model('RoomKeeper', roomkeeperSchema);
  const Student = new mongoose.model('Student', studentSchema);
  const CleanRequest = new mongoose.model('CleanRequest', cleanRequestSchema);
  const Complaint = new mongoose.model('Complaint', complaintSchema);
  const Suggestion = new mongoose.model('Suggestion', suggestionSchema);
  const Feedback = new mongoose.model('Feedback', feedbackSchema);
  
  //function to validate user 
  function validateUser(user) {
    const schema = Joi.object({
      "email": Joi.string().min(5).max(255).required().email(),
      "password": Joi.string().min(3).max(255).required(),
      "fullname": Joi.string().min(3).max(255).required(),
      "hostel": Joi.string().min(3).max(255).required()
    });
  
    return schema.validate(user);
  }

  exports.Admin = Admin; 
  exports.RoomKeeper = RoomKeeper; 
  exports.Student = Student;
  exports.CleanRequest = CleanRequest;  
  exports.Complaint = Complaint; 
  exports.Suggestion = Suggestion; 
  exports.Feedback = Feedback; 
  exports.validate = validateUser;