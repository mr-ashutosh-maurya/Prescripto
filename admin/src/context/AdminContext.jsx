import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"")
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    
    const getAlldoctors = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/all-doctors`,{headers: {token:aToken}})
            
            if(data.success){
                setDoctors(data.doctors);
                console.log(doctors)
            }
            else{
                console.log(data.message)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

 
    const cancelAppointments = async (appointmentId) => {
        try {
            const {data} = await axios.post(`${backendUrl}/api/admin/cancel-appointment`,{appointmentId},{headers: {token:aToken}})
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }   


    const getAllAppointments = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/appointments`,{headers: {token:aToken}})
            console.log(data)
            if(data.success){
                setAppointments(data.appointments);
                console.log(doctors)
            }
            else{
                console.log(data.message)
            }
            
        } catch (error) {
            console.log(error)
        }
    }


    const getDashData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/dashboard`,{headers: {token:aToken}})

            if(data.success){
                setDashData(data.dashData);
                console.log(data.dashData);
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }


    const changeAvailablity = async (docId) =>{
        
        const {data} = await axios.post(`${backendUrl}/api/admin/change-avilablity`, {docId}, {headers: {token:aToken}})

        if(data.success){
            toast.success(data.message)
            getAlldoctors()
        }
        else{
            console.log(data.message)
            toast.error(data.message)
        }
    }
    
    const value = {
        aToken, setAToken, backendUrl, getAlldoctors, doctors, changeAvailablity, appointments, setAppointments, getAllAppointments,
        cancelAppointments, getDashData, dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider