import { useState, useEffect } from 'react';
import customFetch from '../../utils/api';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [amenities, setAmenities] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data } = await customFetch.get('/api/properties');
    setProperties(data);
  };

  const handleAddProperty = async e => {
    e.preventDefault();
    await customFetch.post('/api/properties', {
      name,
      price,
      location,
      amenities: amenities.split(', '),
    });
    fetchProperties();
  };

  const handleDeleteProperty = async id => {
    await customFetch.delete(`/api/properties/${id}`);
    fetchProperties();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <form onSubmit={handleAddProperty}>
        <input
          type="text"
          placeholder="Name"
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          onChange={e => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          onChange={e => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Amenities (comma separated)"
          onChange={e => setAmenities(e.target.value)}
        />
        <button type="submit">Add Property</button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl mb-2">Existing Properties</h2>
        {properties.map(property => (
          <div key={property._id} className="border p-2 mb-2">
            <p>{property.name}</p>
            <button onClick={() => handleDeleteProperty(property._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
