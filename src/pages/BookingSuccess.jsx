import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import customFetch from "../../utils/api";
import toast from "react-hot-toast";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);

  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await customFetch.get(`/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBooking(data);
      } catch {
        toast.error("Failed to retrieve booking details.");
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Booking Successful!</h1>
      <p>Property: {booking.property.name}</p>
      <p>Location: {booking.property.location}</p>
      <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p>Status: {booking.status}</p>
    </div>
  );
};

export default BookingSuccess;
