import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token, getAllDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] +
      " " +
      months[Number(dateArray[1]) - 1] +
      " " +
      dateArray[2]
    );
  };

  /// GET USER APPOINTMENTS
  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /// CANCEL USER APPOINTMENT
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // ----------------- Skeleton Loader -----------------
  const SkeletonAppointment = () => (
    <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b animate-pulse">
      <div>
        <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-48 bg-gray-200 rounded"></div>
        <div className="h-3 w-40 bg-gray-200 rounded"></div>
      </div>
      <div className="flex flex-col gap-2 justify-end">
        <div className="h-8 w-40 bg-gray-200 rounded"></div>
        <div className="h-8 w-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
  // ---------------------------------------------------

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div>
        {loading ? (
          // show 3–4 skeletons while loading
          Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonAppointment key={idx} />
          ))
        ) : appointments.length > 0 ? (
          appointments.map((item, idx) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={idx}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-zinc-700">
                <p className="text-neutral-800 font-semibold ">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-end">
                {item.cancelled ? (
                  <button
                    className="text-sm text-red-500 text-center sm:min-w-48 py-2 border rounded cursor-not-allowed border-red-500"
                    disabled
                  >
                    Cancelled
                  </button>
                ) : item.isCompleted ? (
                  <button
                    className="text-sm text-green-500 text-center sm:min-w-48 py-2 border rounded cursor-not-allowed border-green-500"
                    disabled
                  >
                    Completed
                  </button>
                ) : (
                  <>
                    <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-pointer hover:bg-[#5f6fff] hover:text-white transition-all duration-300">
                      Pay Online
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            No appointments found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;
