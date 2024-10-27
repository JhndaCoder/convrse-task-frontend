import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import customFetch from "../../utils/api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await customFetch.get("/api/bookings");
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="section-title">My Bookings</h1>
        <ul className="bookings-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              <p className="property-name">Property: {booking.property.name}</p>
              <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p>Status: {booking.status}</p>
              <Link
                to={`/${booking.property._id}`}
                className="btn view-property-button"
              >
                View Property
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MyBookings;
