import React, { useEffect, useState } from "react";
import { specialityData } from "../../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a short loading delay
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton Loader Component
  const SkeletonItem = () => (
    <div className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 animate-pulse">
      <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-200 rounded-full mb-2"></div>
      <div className="h-3 w-20 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
      id="speciality"
    >
      <h1 className="text-3xl font-medium">Find the Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free
      </p>

      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <SkeletonItem key={idx} />)
          : specialityData.map((item, idx) => (
              <Link
                onClick={() => scrollTo(0, 0)}
                className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
                key={idx}
                to={`/doctors/${item.speciality}`}
              >
                <img
                  className="w-16 sm:w-24 mb-2 transition-all duration-500"
                  src={item.image}
                  alt={item.speciality}
                />
                <p>{item.speciality}</p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
