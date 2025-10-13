import validator from 'validator'
import bcrypt, { genSalt } from 'bcrypt'
import  {v2 as cloudinary} from "cloudinary"
import Doctor from '../models/DoctorModel.js'
import jwt from 'jsonwebtoken'
import Appointment from '../models/AppointmentModel.js'
import User from '../models/UserModel.js'


// -------------- API for Doctor -------------//

// Add Doctor --------------------

const addDoctor = async (req, res) => {
    try {
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body;
        const imageFile = req.file;

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false, message: 'All fields are required.'})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false, message: 'Please enter Valid Email.'})
        }

        if(password.length < 6){
            return res.json({success:false, message: 'Please enter strong password'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const newDoctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(req.body.address),
            date:Date.now(),
        });

        await newDoctor.save();

        return res.json({
            success: true,
            message: "Doctor added successfully.",
            doctor: newDoctor,
        });

    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.json({
        success: false,
        message: error.message,
        });
    }
}

// Get all Doctors --------------------

const allDoctors = async (req, res) => {
    try {
        
        const doctors = await Doctor.find({}).select('-password')
        console.log(doctors)
        return res.json({success:true, doctors})

    } catch (error) {

        console.log(error)
        return res.json({success:false, message:error.message})

    }
}


// Admin login --------------------
const AdminLogin = async (req, res) =>{

    try {

       const {email, password} = req.body;

       if(email === process.env.ADMIN_EMIAL && password === process.env.ADMIN_PASSWORD){
        
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({
                success:true,
                message:"Login Successfull",
                token
            })
        
       }
       else{
            res.json({
            success: false,
            message: "Invalid credentials",
            });
       }
        
    } catch (error) {
       console.error("Error in AdminLogin:", error);
        res.json({
        success: false,
        message: error.message,
        }); 
    }
}

// api to get all doctors list
const appointmentsAdmin = async (req, res) => {
    try {
        
        const appointments = await Appointment.find({})
        return res.json({success:true, appointments})

    } catch (error) {

        console.log(error)
        return res.json({success:false, message:error.message})

    }
}


/// Api to cancel the appointment
const appointmentCancel = async (req, res) => {
    try {
        
        const {appointmentId} = req.body

        const appointmentData = await Appointment.findById(appointmentId)


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

// Api to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        
        const doctors = await Doctor.find({})
        const users = await User.find({})
        const appointments = await Appointment.find({})

        const dashData = {
            doctors: doctors.length,
            users: users.length,
            appointments: appointments.length,
            latestAppointments : appointments.reverse().slice(0,5)
        }

        return res.json({success:true, dashData})

    } catch (error) {
        console.log(error)
        return res.json({success:false, message:error.message})
    }
}

export {addDoctor, AdminLogin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}