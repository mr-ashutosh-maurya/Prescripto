import express from "express"
import {bookAppointment, cancelAppointment, getProfile, listAppointment, updateProfile, userLogin, userRegister} from '../controllers/userController.js'
import userAuth from "../middlewares/userAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router()

userRouter.post('/register', userRegister);
userRouter.post('/login', userLogin);

userRouter.get('/get-profile',userAuth, getProfile);
userRouter.post('/update-profile', upload.single('image'),userAuth, updateProfile);
userRouter.post('/book-appointment',userAuth, bookAppointment);
userRouter.get('/appointments',userAuth, listAppointment);
userRouter.post('/cancel-appointment',userAuth, cancelAppointment);

export default userRouter