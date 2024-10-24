import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VRView from '../components/VRView';
import customFetch from '../../utils/api';
import PaymentButton from '../components/PaymentButton';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            const { data } = await customFetch.get(`/api/properties/${id}`);
            setProperty(data);
        };
        fetchProperty();
    }, [id]);

    if (!property) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold">{property.name}</h1>
            <p>Location: {property.location}</p>
            <p>Price: ${property.price}</p>
            <p>Amenities: {property.amenities.join(', ')}</p>
            <VRView panoramaImage={property.vrImage} />
            <PaymentButton property={property} />
        </div>
    );
};

export default PropertyDetails;
