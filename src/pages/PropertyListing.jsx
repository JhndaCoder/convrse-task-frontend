import { useEffect, useState, useCallback } from 'react';
import customFetch from '../../utils/api';
import PropertyCard from '../components/PropertyCard';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const PropertyListing = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });
  const [loading, setLoading] = useState(true);

  const fetchAllProperties = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.get('/api/properties');
      setAllProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProperties();
  }, [fetchAllProperties]);

  useEffect(() => {
    const applyFilters = () => {
      const { location, minPrice, maxPrice } = filters;

      const filtered = allProperties.filter((property) => {
        const matchesLocation = location
          ? property.location.toLowerCase().includes(location.toLowerCase())
          : true;
        const matchesName = search
          ? property.name.toLowerCase().includes(search.toLowerCase())
          : true;
        const matchesMinPrice = minPrice ? property.price >= Number(minPrice) : true;
        const matchesMaxPrice = maxPrice ? property.price <= Number(maxPrice) : true;

        return matchesLocation && matchesName && matchesMinPrice && matchesMaxPrice;
      });

      setFilteredProperties(filtered);
    };

    applyFilters();
  }, [filters, search, allProperties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleReset = () => {
    setFilters({ location: '', minPrice: '', maxPrice: '' });
    setSearch('');
  };

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
      <div className="property-listing">
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
          <button onClick={handleReset} className="reset-button">
            Reset
          </button>
        </div>

        <div className="property-grid">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PropertyListing;
