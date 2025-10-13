import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorroutes.js';
import userRouter from './routes/userRoutes.js';


const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middleware
app.use(express.json());
app.use(cors());


// admin api endpoint
app.use('/api/admin', adminRouter)

// doctor api endpoint
app.use('/api/doctor', doctorRouter)

//admin endpoint
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send("API working...")
})

app.listen(PORT , () => {
    console.log("✅ server started.")
})