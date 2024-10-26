import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/${property._id}`);
  };

  return (
    <article className="property-card-listing">
      <img src={property.image} alt={property.name} className="property-img" />
      <div className="property-footer">
        <h4 className="property-name">{property.name}</h4>
        <p className="property-location">{property.location}</p>
        <p className="property-price">{property.price} USD</p>
        <button className="property-btn" onClick={goToDetails}>
          View Details
        </button>
      </div>
    </article>
  );
};

export default PropertyCard;
