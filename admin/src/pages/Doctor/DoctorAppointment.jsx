import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {

    const {dToken, appointments, getAppoitments, cancelAppointment, completeAppointment} = useContext(DoctorContext)
    const {caluclateAge, slotDateFormat, currency} = useContext(AppContext)

    useEffect(()=>{
        getAppoitments()
    },[dToken])
    
  return (
    <div className='w-full max-w-6xl m-5'>
        <p className='mb-3 text-lg font-medium'>All Appointments</p>

        <div className='bg-white border border-gray-400 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
            <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-400'> 
                <p>#</p>
                <p>Patient</p>
                <p>Payment</p>
                <p>Age</p>
                <p>Date & Time</p>
                <p>Fees</p>
                <p>Actions</p>
            </div>

            {
                appointments.map((item, index)=>(
                    <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center gap-1 text-gray-500 py-3 px-6 border-b border-gray-400 hover:bg-gray-50' key={index}>
                        <p className='max-sm:hidden'>{index+1}</p>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 rounded-full' src={item.userData.image} alt="" />
                            <p>{item.userData.name}</p>
                        </div>
                        <div>
                            <p className='text-xs inline border border-[#5f6fff] px-2 rounded-full'>{item.payment ? "Online" : 'Cash'}</p>
                        </div>
                        <p className='max-sm:hidden'>{caluclateAge(item.userData.dob)}</p>
                        <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                        <p>{currency}{item.amount}</p>

                        {
                            item.cancelled
                            ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                            : item.isCompleted 
                                ? <p className='text-green-400 text-xs font-medium'>Completed</p>
                                : <div className='flex'>
                                        <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                                        <img onClick={()=>completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                                  </div>
                        }
                        
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default DoctorAppointment