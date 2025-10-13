import express from "express"
import {addDoctor, adminDashboard, AdminLogin, allDoctors, appointmentCancel, appointmentsAdmin} from '../controllers/admincontroller.js'
import upload from "../middlewares/multer.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import {changeAvailablity} from "../controllers/DoctorControllers.js"

const adminRouter = express.Router()

adminRouter.post('/add-doctor', isAuthenticated, upload.single('image'), addDoctor)
adminRouter.post('/login', AdminLogin)
adminRouter.get('/all-doctors',isAuthenticated, allDoctors)
adminRouter.post('/change-avilablity',isAuthenticated, changeAvailablity)
adminRouter.get('/appointments',isAuthenticated, appointmentsAdmin)
adminRouter.post('/cancel-appointment',isAuthenticated, appointmentCancel)
adminRouter.get('/dashboard',isAuthenticated, adminDashboard)

export default adminRouter