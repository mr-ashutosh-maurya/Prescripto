import express from "express"
import {appointmentCancel, appointmentComplete, appointmentsDoctor, doctorList, loginDoctor, doctorDashboard, doctorProfile, updateDoctorProfile} from '../controllers/DoctorControllers.js'
import doctorAuth from "../middlewares/doctorAuth.js"

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments',doctorAuth, appointmentsDoctor)
doctorRouter.post('/cancel-appointment',doctorAuth, appointmentCancel)
doctorRouter.post('/complete-appointment',doctorAuth, appointmentComplete)
doctorRouter.get('/dashboard',doctorAuth, doctorDashboard)
doctorRouter.get('/doctor-profile',doctorAuth, doctorProfile)
doctorRouter.post('/update-profile',doctorAuth, updateDoctorProfile)

export default doctorRouter