const PropertyCard = ({property}) => (
  <div className="border p-4 rounded shadow-md">
    <img
      src={property.image}
      alt={property.name}
      className="w-full h-48 object-cover rounded"
    />
    <h3 className="text-xl font-semibold mt-2">{property.name}</h3>
    <p>Location: {property.location}</p>
    <p>Price: ${property.price}</p>
    <p>Amenities: {property.amenities.join (', ')}</p>
  </div>
);

export default PropertyCard;
