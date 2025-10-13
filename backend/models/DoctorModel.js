import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL or file path
      default: "",
    },
    speciality: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: true,
    },
    experience: {
      type: String,
      default: "0 Years",
    },
    available: {
      type: Boolean,
      default: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      default: {},
      required: true,
    },
    date: {
      type: Number,
      default: Date.now,
    },
    slots_booked: {
      type: Object, // e.g., ["10:00-10:30", "11:00-11:30"]
      default: {},
    },
  },
  {
    minimize: false,
    timestamps: true, // optional, keeps createdAt & updatedAt
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
