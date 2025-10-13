import Doctor from '../models/DoctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Appointment from '../models/AppointmentModel.js';


const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await Doctor.findById(docId);
        if (!docData) return res.json({ success: false, message: "Doctor not found" });

        await Doctor.findByIdAndUpdate(docId, { available: !docData.available });
        return res.json({ success: true, message: "Availability changed" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('-email -password');
        return res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


// api for doctor login

const loginDoctor = async (req, res) => {
    try {
        
        const {email, password} = req.body

        const doctor = await Doctor.findOne({email})

        if(!doctor){
            return res.json({success: false, message:"Invalid credentials"})
        }

        const ismatch = await bcrypt.compare(password, doctor.password) 
        
        if(ismatch){

            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)

            return res.json({success: true, token, message:"Login successful"})
        }    
        else{
           return res.json({success: false, message:"Invalid credentials"}) 
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


// Api to get doctor appointments for doctor pannel
const appointmentsDoctor = async (req, res) => {
    try {

        const docId = req.docId
        const appointments = await Appointment.find({docId})

        return res.json({ success: true, appointments });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Server error" });
    }
}


// ✅ Mark appointment as completed
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;

    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.docId.toString() === docId) {

      await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment Completed" });

    } else {

      return res.json({ success: false, message: "Unauthorized or Mark Failed" });

    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server error" });
  }
};

// ✅ Cancel appointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;

    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.docId.toString() === docId) {

      await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: "Appointment Cancelled" });

    } else {

      return res.json({ success: false, message: "Unauthorized or Cancellation Failed" });

    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server error" });
  }
};


// doctor DashBoard
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;

    const appointments = await Appointment.find({ docId });

    let earnings = 0;
    const patientSet = new Set();

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }

      patientSet.add(item.userId.toString());
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    return res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Server error" });
  }
};


//---------------doctor Profile-----------------

const doctorProfile = async (req, res) => {
  try {

    const docId = req.docId
    const profileData = await Doctor.findById(docId).select('-password')

    return res.json({ success: true, profileData});

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Server error" });
  }
};


// ------------ UPDATE DOCTOR PROFILE -----------------
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId // comes from middleware
    const { available,fees, address, experience } = req.body;
    
    const updateDoctorProfile = await Doctor.findByIdAndUpdate(docId, {available,fees, address, experience })
    return res.json({ success: true, message:"Profile updated"});

  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.json({ success: false, message: error.message });
  }
};


export { changeAvailablity, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile}
