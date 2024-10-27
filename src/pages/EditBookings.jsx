import { useEffect, useState, useCallback, useRef } from "react";
import customFetch from "../../utils/api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const EditBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [customerEmail, setCustomerEmail] = useState("");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFirstLoad = useRef(true);

  const fetchAllBookings = useCallback(async () => {
    try {
      const { data } = await customFetch.get("/api/bookings");
      console.log("Fetched bookings:", data);
      setAllBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings.");
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
    if (isFirstLoad.current) {
      toast.success("Bookings loaded successfully!");
      isFirstLoad.current = false;
    }
  }, [fetchAllBookings]);

  useEffect(() => {
    applyFilters();
  }, [search, allBookings]);

  const applyFilters = () => {
    const filtered = allBookings.filter((booking) =>
      booking.property.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredBookings(filtered);
  };

  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleCustomerEmailChange = (e) => setCustomerEmail(e.target.value);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { status };
      if (
        status.toLowerCase() === "pending" ||
        status.toLowerCase() === "confirmed"
      ) {
        const userResponse = await customFetch.get(
          `/api/auth/email/${customerEmail}`,
        );
        if (!userResponse.data) {
          toast.error("User with this email does not exist.");
          setIsSubmitting(false);
          return;
        }
        payload.userEmail = customerEmail;
      }

      await customFetch.put(
        `/api/bookings/update-status/${editingBooking._id}`,
        payload,
      );
      toast.success("Booking updated successfully!");
      await fetchAllBookings();
      resetForm();
    } catch (error) {
      console.error("Error updating booking:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to update booking.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await customFetch.delete(`/api/bookings/${bookingId}`);
      toast.success("Booking deleted successfully!");
      await fetchAllBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking.");
    }
  };

  const startEditing = (booking) => {
    setEditingBooking(booking);
    setStatus(booking.status);
    setCustomerEmail(booking.user.email || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingBooking(null);
    setStatus("Pending");
    setCustomerEmail("");
  };

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <h1 className="dashboard-title">Edit Bookings</h1>

        <div className="filters-container">
          <input
            type="text"
            placeholder="Search by Property Name"
            value={search}
            onChange={handleSearchChange}
            className="filter-input"
          />
        </div>

        {editingBooking && (
          <div className="property-form-container">
            <h2 className="section-title">Update Booking</h2>
            <form onSubmit={handleFormSubmit} className="property-form">
              <p>Property: {editingBooking.property.name}</p>
              <p>
                Booking Date:{" "}
                {new Date(editingBooking.bookingDate).toLocaleDateString()}
              </p>

              <select
                name="status"
                value={status}
                onChange={handleStatusChange}
                required
                className="filter-input"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {(status === "pending" || status === "confirmed") && (
                <input
                  type="email"
                  placeholder="Customer Email"
                  value={customerEmail}
                  onChange={handleCustomerEmailChange}
                  className="filter-input"
                  required
                />
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                Update Booking
              </button>
              <button onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="property-grid">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="admin-property-card">
              <h3 className="property-name">{booking.property.name}</h3>
              <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p>Status: {booking.status}</p>
              <button
                onClick={() => startEditing(booking)}
                className="update-button"
              >
                Edit Booking
              </button>
              <button
                onClick={() => handleDeleteBooking(booking._id)}
                className="delete-button"
              >
                Delete Booking
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EditBookings;
