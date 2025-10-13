import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets";
import axios from "axios";
import {toast} from 'react-toastify'

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = "$"
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData, setUserData] = useState(false)


    const getAllDoctors = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/doctor/list`)
            
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


    const loadUserPofileData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/get-profile`, {headers:{token}})

            if(data.success){
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getAllDoctors();
    },[])

    useEffect(()=>{
        if(token)
            loadUserPofileData();
        else
            setUserData(false)
    },[token])
    
    const value = {
        doctors,getAllDoctors,
        currencySymbol,
        token, setToken, 
        backendUrl, 
        setUserData, userData, 
        loadUserPofileData,

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider