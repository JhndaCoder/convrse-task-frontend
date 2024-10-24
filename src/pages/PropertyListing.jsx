import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import Select from 'react-select';
import customFetch from '../../utils/api';

const PropertyListing = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await customFetch.get('/api/properties');
      setProperties(data);
      setFilteredProperties(data);
      console.log(data);

    };
    fetchProperties();
  }, []);

  const handleLocationChange = selected => {
    setLocation(selected.value);
    const filtered = properties.filter(p => p.location === selected.value);
    setFilteredProperties(filtered);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Properties</h1>
      <Select
        options={properties.map(p => ({ label: p.location, value: p.location }))}
        onChange={handleLocationChange}
        placeholder="Filter by Location"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredProperties.map(property => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyListing;
