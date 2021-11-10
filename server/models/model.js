require("dotenv").config();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const secret = process.env.SECRET;
//Creating Schema 

const adminSchema = new mongoose.Schema({
    name: String,
    hostel: String,
    email: String,
    password: String,
    phone: Number,
    profileimg: {
      data: Buffer,
      contentType: String
    }
  })
  const roomkeeperSchema = new mongoose.Schema({
    name: String,
    password: String,
    phone: Number,
    email: String,
    hostel: String,
    profileimg: {
      data: Buffer,
      contentType: String
    },
    ratings:[],
    complaints:[],
  })
  const studentSchema = new mongoose.Schema({
    name: String,
    password: String,
    phone: Number,
    email: String,
    hostel: String,
    profileimg: {
      data: Buffer,
      contentType: String
    },
    floor: Number,
    room: String
  })
  const cleanRequestSchema = new mongoose.Schema({
    studentId: String,
    roomkeeper: String,
    room: String,
    floor: Number,
    hostel: String,
    time: String,
    date: String,
    timeIn: String,
    timeOut: String,
    rating: Number,
    requestStatus: {
      type: String,
      enum: ['Pending', 'Alloted', 'Rejected', 'Completed'],
      default: 'Pending'
    },
    message: String,
    rejectReason: Object
  })
  const complaintSchema = new mongoose.Schema({
    hostel: String,
    feedbackId: String,
    studentId: String,
    details: {
      message: String,
      requestId: String,
    }
  })
  const suggestionSchema = new mongoose.Schema({
    hostel: String,
    feedbackId: String,
    studentId: String,
    details: {
      message: String,
      requestId: String,
    }
  })
  const feedbackSchema = new mongoose.Schema({
    hostel: String,
    studentId: String,
    requestId: String,
    rating:Number,
    message: String
  })

  const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
  });

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
  const Token = new mongoose.model('Token',tokenSchema)

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
  exports.Token = Token;
  exports.validate = validateUser;