# 🏠 Real Estate Property Listing Platform - Frontend  

Welcome to the **frontend repository** for the Real Estate Property Listing Platform! This frontend provides a responsive and user-friendly interface for customers and admins, allowing seamless navigation through property listings, bookings, and platform management. It integrates with the backend to offer a smooth, complete user experience.

---

## 🌟 Features Implemented

### **User Roles & Navigation**
- **Customer:**
  - Browse and search for properties.
  - View detailed property information, including VR views.
  - Book properties and manage bookings.
- **Admin:**
  - View all property listings and bookings.
  - Edit, delete, and manage platform content via the dashboard.

- **Navigation:**
  - Dynamic routing based on user roles (customer/admin).
  - Protected routes to restrict access based on authentication and roles.

---

## 🚀 Pages and Frontend Components

1. **Authentication Screens:**
   - **Login and Register Pages:** Allows users to log in or register with validation.
   - **Logout Component:** Handles user logout and token clearance.

2. **Property Listings Page:**
   - Displays available properties with images, prices, and locations.
   - **Search and Filters:**  
     - Filter by price, location, and availability.
     - Search properties by name. *(Optional - Implemented 🎉)*

3. **Property Details Page:**
   - Provides in-depth information about properties, including amenities.
   - **VR View Integration:** Utilizes Panolens.js for a 360-degree view. *(Optional - Implemented 🎉)*

4. **Booking Management:**
   - **My Bookings Page:** View and manage user bookings.
   - **Edit Bookings:** Allows modifications to existing bookings.
   - **Booking Success Page:** Confirmation screen after successful booking.

5. **Admin Dashboard:**
   - **Admin Dashboard Component:** Manage properties and bookings efficiently.
   - **CRUD Operations:** Directly from the frontend for admins (via API).

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite.js  
- **State Management:** Context API / React Hooks  
- **Styling:** Tailwind CSS  
- **Routing:** React Router  
- **Authentication:** Token-based (JWT) with protected routes  
- **UI Components:** Custom reusable components  

---

## 📂 Project Structure

```plaintext
convrse-front/
│
├── public/              # Public assets (e.g., icons, images)
│   └── vite.svg         # Vite logo
├── src/                 # Main source code
│   ├── assets/          # Static assets used in components
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── PropertyCard.jsx  # Displays individual property info
│   │   ├── AdminDashboard.jsx # Admin dashboard component
│   │   └── VRView.jsx        # 360-degree view component
│   ├── pages/           # Pages with specific routes
│   │   ├── PropertyListing.jsx  # Main listing page
│   │   ├── PropertyDetails.jsx  # Detailed property view
│   │   ├── Login.jsx          # Login screen
│   │   ├── Register.jsx       # Registration page
│   │   ├── MyBookings.jsx     # User bookings page
│   │   └── BookingSuccess.jsx # Booking confirmation page
│   ├── utils/           # Utility functions (e.g., API handling)
│   │   └── api.js       # API helper functions
│   ├── index.css        # Global styles
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point for React
├── .env                 # Environment variables
├── .gitignore           # Ignored files for Git
├── package.json         # Project dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # Project README
```

---

## 🧪 Additional Features (Optional - Implemented 🎉)

- **VR View Integration** using Panolens.js for an immersive 360-degree experience.
- **Protected Routes** to ensure only authenticated users access specific pages.
- **Role-based Navigation** with separate views for customers and admins.

---

## 📦 How to Run the Project

### Prerequisites:
- **Node.js** installed (v14+ recommended).
- **Git** installed for version control.

### Step-by-Step Setup:
1. **Clone the Repository:**
   ```bash
   git clone <your-repository-url>
   cd convrse-front
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   - Rename `.env.example` to `.env` and update with your configuration.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5173`.

5. **Run Linter:**
   ```bash
   npm run lint
   ```

---

## 🔗 API Integration

- **Backend API:** The frontend communicates with the backend for authentication, property listings, and bookings.
- **API Helper Functions:** Found in `utils/api.js` to streamline API calls.

---

## 🚀 CI/CD Pipeline

- **GitHub Actions:** Automates builds, testing, and deployment to the cloud.
- **Linting and Testing:** Pre-configured hooks with Husky for code quality.
- **Vercel Deployment:** Ready for one-click deployment.

---

## 🛡️ Security

- **Token-based Authentication:** Secures routes using JWT.
- **Protected Routes:** Ensures only logged-in users access critical pages.
- **Role-based Access Control:** Grants admin-only access to dashboard features.

---

## 📑 Submission Checklist

- ✅ Frontend repository on GitHub.
- ✅ Deployment link provided.
- ✅ Video demonstration of the platform's functionalities.

---

## 🎯 Conclusion

This frontend provides a clean, modern, and responsive user interface for a property listing platform. It leverages React and Vite for fast, efficient development, with thoughtful UI components and seamless backend integration. All mandatory and optional features have been implemented, ensuring a robust solution.

---

## 🤝 Acknowledgments

Special thanks to the tools and libraries used in this project:
- **React.js** for the frontend framework.
- **Vite.js** for blazing-fast builds.
- **Panolens.js** for the VR integration.
- **Tailwind CSS** for utility-first styling.

---

Feel free to explore the code and let me know if there are any suggestions for improvements! 🎉

---