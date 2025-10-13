import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [filter, setFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    setLoading(true);
    setTimeout(() => {
      if (speciality) {
        setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
      } else {
        setFilterDoc(doctors);
      }
      setLoading(false);
    }, 800); // simulate a short loading delay for better UX
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  // ------------------- Skeleton Loader -------------------
  const SkeletonCard = () => (
    <div className="border border-blue-200 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-blue-100 h-40 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-200"></div>
          <div className="h-3 w-20 bg-green-200 rounded"></div>
        </div>
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
  // --------------------------------------------------------

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors speciality.</p>
      <div className="flex flex-col sm:flex-row items-start mt-5 gap-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            filter ? "bg-[#5f6fff] text-white" : ""
          }`}
          onClick={() => setFilter((prev) => !prev)}
        >
          Filters
        </button>

        {/* Filter Sidebar */}
        <div
          className={`w-1/5 flex-col gap-4 text-sm text-gray-600 ${
            filter ? "flex" : "hidden sm:flex"
          }`}
        >
          {[
            "General physician",
            "Gynecologist",
            "Dermatologist",
            "Pediatricians",
            "Neurologist",
            "Gastroenterologist",
          ].map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality === spec
                  ? navigate("/doctors")
                  : navigate(`/doctors/${spec}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === spec ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className="w-full grid sm:grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
            : filterDoc.map((item, idx) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                  key={idx}
                >
                  <img className="bg-blue-50 h-40 w-full object-cover" src={item.image} alt="" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-center text-green-500">
                      <p className="h-2 w-2 rounded-full bg-green-500"></p>
                      <p>Available</p>
                    </div>
                    <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.speciality}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
