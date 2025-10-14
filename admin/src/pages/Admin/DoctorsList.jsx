import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, getAlldoctors, aToken, changeAvailablity } =
    useContext(AdminContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (aToken) {
        setLoading(true);
        await getAlldoctors();
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [aToken]);

  // ---------------- Skeleton Loader ----------------
  const SkeletonCard = () => (
    <div className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden animate-pulse">
      <div className="bg-indigo-100 h-36 w-full"></div>
      <div className="p-4 space-y-2">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
  // --------------------------------------------------

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
          : doctors.length > 0
          ? doctors.map((item, idx) => (
              <div
                className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group transition-all duration-500"
                key={idx}
              >
                <img
                  className="bg-indigo-50 group-hover:bg-[#5f6fff] transition-all duration-500 h-36 w-full object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="p-4">
                  <p className="text-neutral-800 text-lg font-medium">
                    {item.name}
                  </p>
                  <p className="text-zinc-600 text-sm">{item.speciality}</p>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      onChange={() => changeAvailablity(item._id)}
                      checked={item.avialable}
                    />
                    <p>Available</p>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <p className="text-gray-500 text-center w-full pt-10">
                No doctors found.
              </p>
            )}
      </div>
    </div>
  );
};

export default DoctorsList;
