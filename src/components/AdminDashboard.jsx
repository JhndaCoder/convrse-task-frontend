import { useEffect, useState, useCallback, useRef } from "react";
import customFetch from "../../utils/api";
import VRView from "./VRView";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [formData, setFormData] = useState(initialFormState());
  const [editingProperty, setEditingProperty] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  });
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFirstLoad = useRef(true);

  const fetchAllProperties = useCallback(async () => {
    try {
      const { data } = await customFetch.get("/api/properties");
      setAllProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties.");
    }
  }, []);

  useEffect(() => {
    fetchAllProperties();
    if (isFirstLoad.current) {
      toast.success("Properties loaded successfully!");
      isFirstLoad.current = false;
    }
  }, [fetchAllProperties]);

  useEffect(() => {
    applyFilters();
  }, [filters, search, allProperties]);

  const applyFilters = () => {
    const { location, minPrice, maxPrice } = filters;

    const filtered = allProperties.filter((property) => {
      const matchesLocation = location
        ? property.location.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchesName = search
        ? property.name.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesMinPrice = minPrice
        ? property.price >= Number(minPrice)
        : true;
      const matchesMaxPrice = maxPrice
        ? property.price <= Number(maxPrice)
        : true;

      return (
        matchesLocation && matchesName && matchesMinPrice && matchesMaxPrice
      );
    });

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProperty) {
        await customFetch.put(`/api/properties/${editingProperty._id}`, {
          ...formData,
          amenities: formData.amenities.split(", "),
        });
        toast.success("Property updated successfully!");
      } else {
        await customFetch.post("/api/properties", {
          ...formData,
          amenities: formData.amenities.split(", "),
        });
        toast.success("Property added successfully!");
      }
      await fetchAllProperties();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      price: property.price,
      location: property.location,
      amenities: property.amenities.join(", "),
      image:
        property.image ||
        "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      vrImage:
        property.vrImage ||
        "https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/tunnel.jpg",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProperty = async (id) => {
    try {
      await customFetch.delete(`/api/properties/${id}`);
      await fetchAllProperties();
      toast.success("Property deleted successfully!");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormState());
    setEditingProperty(null);
  };

  const handleResetFilters = () => {
    setFilters({ location: "", minPrice: "", maxPrice: "" });
    setSearch("");
  };

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <h2 className="section-title">Filters</h2>
        <div className="filters-container">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Search properties"
            value={search}
            onChange={handleSearchChange}
            className="filter-input"
          />
          <button onClick={handleResetFilters} className="reset-button">
            Reset
          </button>
        </div>

        <h2 className="section-title">
          {editingProperty ? "Update Property" : "Add Property"}
        </h2>
        <div className="property-form-container">
          <form onSubmit={handleFormSubmit} className="property-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="amenities"
              placeholder="Amenities (comma separated)"
              value={formData.amenities}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="vrImage"
              placeholder="VR Image URL"
              value={formData.vrImage}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {editingProperty ? "Update Property" : "Add Property"}
            </button>
            {editingProperty && (
              <button onClick={resetForm} className="cancel-button">
                Cancel
              </button>
            )}
          </form>
        </div>

        <h2 className="section-title">Properties</h2>
        <div className="property-grid">
          {filteredProperties.map((property) => (
            <div key={property._id} className="admin-property-card">
              <h3 className="property-name">{property.name}</h3>
              <p className="property-location">Location: {property.location}</p>
              <p className="property-price">Price: ${property.price}</p>
              <p className="property-amenities">
                Amenities: {property.amenities.join(", ")}
              </p>
              {property.image && (
                <img
                  src={property.image}
                  alt={property.name}
                  className="property-image"
                />
              )}
              {property.vrImage && <VRView panoramaImage={property.vrImage} />}
              <button
                onClick={() => startEditing(property)}
                className="update-button"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteProperty(property._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const initialFormState = () => ({
  name: "",
  price: "",
  location: "",
  amenities: "",
  image: "",
  vrImage: "",
});

export default AdminDashboard;
