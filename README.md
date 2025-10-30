
## 🩺 Prescripto – Doctor Appointment Booking Web App

A **full-stack appointment booking system** built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
Prescripto allows **patients** to book, pay, and manage doctor appointments online, while **doctors** and **admins** have their own dashboards for managing profiles, availability, and bookings.  

---

## 🚀 Features

- 👥 **Multi-Role Authentication:** Separate login flows for Patients, Doctors, and Admins using **JWT-based authentication**.  
- 🗓️ **Appointment Management:** Book, cancel, and view appointments in real-time.  
- 💳 **Razorpay Payment Integration:** Secure online payments with backend verification and real-time status updates.  
- 🩺 **Doctor Dashboard:** Manage profile, fees, appointments, and availability directly from the doctor panel.  
- 🧑‍💻 **Admin Panel:** Manage doctors, users, and appointments, view analytics, and control platform activity.  
- 🖼️ **Cloudinary Integration:** For doctor and user profile image uploads.  
- 💾 **Context API for State Management:** Global state management for authentication and UI consistency.  
- 📱 **Responsive UI:** Built with **TailwindCSS**, ensuring a smooth experience on mobile and desktop devices.  
- 🔒 **Secure Backend:** Password hashing, token validation, and role-based access control.

---

## 🧰 Tech Stack

**Frontend:** React, Vite, TailwindCSS, Axios, React Router  
**Backend:** Node.js, Express.js, MongoDB (Atlas), Mongoose  
**Authentication:** JWT (JSON Web Token)  
**Payments:** Razorpay  
**Image Uploads:** Cloudinary  
**State Management:** React Context API  

---

## 🧭 Project Structure

```

Prescripto/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Pages (Home, Doctors, Profile, Admin, etc.)
│   │   ├── context/     # Global state (Auth, Booking, etc.)
│   │   └── utils/       # Constants, config
│   └── public/
│
├── server/              # Backend (Node.js + Express)
│   ├── config/          # MongoDB, Cloudinary, Razorpay setup
│   ├── controllers/     # Business logic for routes
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   └── index.js         # App entry point
│
└── README.md

````

## ⚙️ Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ashutoshmaurya9718/prescripto.git
   cd prescripto


2. **Install Dependencies**

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Set Environment Variables**

   Create a `.env` file in the `/server` folder with:

   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the Application**

   ```bash
   # Run frontend
   cd client
   npm run dev

   # Run backend
   cd ../server
   npm run start
   ```

5. **Access the App**

   * Frontend: `http://localhost:5173`
   * Backend: `http://localhost:5000`

---

## 🧩 Key Modules

| Module      | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| **Patient** | Register, login, browse doctors, book and pay for appointments.                     |
| **Doctor**  | Manage appointments, update profile, set availability, mark appointments completed. |
| **Admin**   | Oversee platform users, manage doctor approval, track bookings and analytics.       |

---

## 🎯 Learning Outcomes

* Mastered **role-based authentication and authorization** in full-stack apps.
* Gained hands-on experience integrating **payment gateways** with frontend-backend verification.
* Strengthened understanding of **scalable project structure and RESTful API design**.
* Improved UI/UX implementation using **TailwindCSS** and **responsive layouts**.

---

## 🧠 Future Enhancements

* 📅 Add email/SMS appointment reminders
* ⭐ Implement doctor ratings and reviews
* 📆 Integrate Google Calendar synchronization
* 🧾 Generate downloadable invoices after payment

---

## 🧑‍💻 Author

**👋 Ashutosh Maurya**
💼 Developer | MERN Stack Enthusiast
📫[Portfolio](https://ashutoshmaurya.site)

---

*“Prescripto was built to explore real-world full-stack development, secure payment integration, and scalable architecture using the MERN stack.”*

