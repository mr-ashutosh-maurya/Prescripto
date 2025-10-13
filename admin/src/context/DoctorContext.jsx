import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'


export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):"")
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashdata] = useState(false)
    const [profileData, setProfileData] = useState(false)


    const getAppoitments  = async () => {
        try {

            const {data} =await axios.get(`${backendUrl}/api/doctor/appointments`,{headers:{dToken}})
            console.log(data)
            if(data.success){
                setAppointments(data.appointments.reverse())
                console.log(appointments)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log("error :",error.message)
        }
    }


    const getProfileData  = async () => {
        try {

            const {data} =await axios.get(`${backendUrl}/api/doctor/doctor-profile`,{headers:{dToken}})
            console.log(data)
            if(data.success){
                setProfileData(data.profileData)
                console.log(profileData)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log("error :",error.message)
        }
    }



    const completeAppointment = async (appointmentId) =>{
        try {

            const {data} =await axios.post(`${backendUrl}/api/doctor/complete-appointment`,{appointmentId},{headers:{dToken}})
            console.log(data)
            if(data.success){
                toast.success(data.message)
                getAppoitments()
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            console.log("error :",error.message)        
        }
    }

    const cancelAppointment = async (appointmentId) =>{
        try {

            const {data} =await axios.post(`${backendUrl}/api/doctor/cancel-appointment`,{appointmentId},{headers:{dToken}})
            console.log(data)
            if(data.success){
                toast.success(data.message)
                getAppoitments()
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            console.log("error :",error.message)        
        }
    }


    const getDashData = async  () =>{
        try {
            const {data} = await axios.get(`${backendUrl}/api/doctor/dashboard`, {headers:{dToken}}) 
                
            if(data.success){
                setDashdata(data.dashData)
                console.log(data.dashData)
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            console.log("error :",error.message)  
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl, appointments, setAppointments, getAppoitments,
        cancelAppointment, completeAppointment, dashData, setDashdata,
        getDashData, setProfileData, profileData, getProfileData
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider