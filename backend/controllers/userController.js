import UserModel from '../models/UserModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary'
import Doctor from '../models/DoctorModel.js';
import User from '../models/UserModel.js';
import Appointment from '../models/AppointmentModel.js';
import razorpay from 'razorpay' 

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'All fields are required.' });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email.' });
        }

        // Check password strength
        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters long.' });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email already registered.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const userData = new UserModel({
            name,
            email,
            password: hashedPassword,
        });
        await userData.save();

        // Create token
        const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
            expiresIn: "7d", // optional: token expiry
        });

        return res.json({
            success: true,
            message: "User registered successfully.",
            // user: userData,
            token,
        });

    } catch (error) {
        console.error("Error in userRegister:", error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};


// _________ USER LOGIN ____________

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required." });
        }

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials." });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d", // optional: 7-day token
        });

        return res.json({
            success: true,
            message: "Login successful.",
            // user,
            token,
        });

    } catch (error) {
        console.log("Error in userLogin:", error);
        res.json({ success: false, message: error.message });
    }
};


// ------------ API TO GET USR DATA -----------------
const getProfile = async (req, res) => {

    try {

        const userId = req.user.id;// comes from JWT middleware
        const userData = await UserModel.findById(userId).select('-password')

        return res.json({success:true, userData})
        
    } catch (error) {
       console.log(error);
       res.json({ success: false, message: error.message }); 
    }
}



// ------------ UPDATE USER PROFILE -----------------
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // comes from middleware
    const { name, gender, dob, phone, address } = req.body;
    const imageFile = req.file;

    // Build update object dynamically (only update provided fields)
    const updatedData = {};
    if (name) updatedData.name = name;
    if (gender) updatedData.gender = gender;
    if (dob) updatedData.dob = dob;
    if (phone) updatedData.phone = phone;
    if (address) updatedData.address = JSON.parse(req.body.address);  // make sure it's an object

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true } // return updated document
    ).select("-password");

    if(imageFile){

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:'image'})
        const imageURL = imageUpload.secure_url

        await UserModel.findByIdAndUpdate(userId, {image:imageURL})
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
    //   user: updatedUser,
    });

  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// -----------------BOOK APPOINTMENT-----------------

const bookAppointment = async (req, res) => {

    try {
        const {docId, slotDate, slotTime} = req.body;
        const userId = req.user.id;

        const docData = await Doctor.findById(docId).select("-password")

        if(!docData){
            return res.json({success:false, message:"Doctor not available"})
        }

        let slots_booked = docData.slots_booked

        // checking slot availablity
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false, message:"slot not available"})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await User.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now()
        }


        const newAppointment = new Appointment(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await Doctor.findByIdAndUpdate(docId,{slots_booked})
        return res.json({success:true, message:"Appointment Booked"})

    } catch (error) {
         console.error(error);
         res.json({ success: false, message: error.message });
    }
}

// ---------------- GET USER APPOINTMENT ----------------
const listAppointment = async (req, res) => {
    try {
        
        const userId = req.user.id;
        const appointments = await Appointment.find({userId})

        return res.json({success:true, appointments})

    } catch (error) {
        console.log(error)
        return res.json({success:false, message:error.message})
    }
}


// ---------------- cancel USER APPOINTMENT ----------------
const cancelAppointment = async (req, res) => {
    try {
        
        const userId = req.user.id;
        const {appointmentId} = req.body

        const appointmentData = await Appointment.findById(appointmentId)

        // verify appointment user
        if(appointmentData.userId !== userId){
            return res.json({success:false, message:"Unauthorized action"})
        }

        await Appointment.findByIdAndUpdate(appointmentId, {cancelled:true})
        
        // releasing doctor slot
        const {docId, slotDate, slotTime} = appointmentData
        const doctorData = await Doctor.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await Doctor.findByIdAndUpdate(docId, {slots_booked})

        return res.json({success:true, message:"Appointment cancelled"})


    } catch (error) {
        console.log(error)
        return res.json({success:false, message:error.message})
    }
}


// ---------- RAZORPAY NTEGRATION FOR PAYMENTS ----------------
// 11:40 min --. payment integration
// const razorpayInstance = new razorpay({
//     key_id:'',
//     key_secret:''
// })

export { userRegister, userLogin, getProfile, updateProfile , bookAppointment, listAppointment, cancelAppointment};
