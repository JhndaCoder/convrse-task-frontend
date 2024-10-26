import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import VRView from '../components/VRView';
import customFetch from '../../utils/api';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [pendingBooking, setPendingBooking] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchPropertyAndBooking = async () => {
            try {
                const { data: propertyData } = await customFetch.get(`/api/properties/${id}`);
                setProperty(propertyData);

                const { data: bookings } = await customFetch.get('/api/bookings', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                const existingBooking = bookings.find(
                    (booking) => booking.property._id === id && booking.user._id === localStorage.getItem('userId')
                );

                if (existingBooking) {
                    if (existingBooking.status === 'pending') {
                        setPendingBooking(existingBooking);
                        const paymentIntentResponse = await customFetch.post('/api/bookings/pay', {
                            bookingId: existingBooking._id,
                        });
                        setClientSecret(paymentIntentResponse.data.clientSecret);
                        setPaymentIntentId(paymentIntentResponse.data.paymentIntentId);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load property details or booking status.');
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyAndBooking();
    }, [id]);

    const handleBooking = async () => {
        setIsBooking(true);
        try {
            const { data } = await customFetch.post(
                '/api/bookings',
                { propertyId: property._id, bookingDate },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            toast.success('Booking created! Please complete payment.');

            const paymentIntentResponse = await customFetch.post('/api/bookings/pay', {
                bookingId: data._id,
            });

            setPendingBooking(data);
            setClientSecret(paymentIntentResponse.data.clientSecret);
            setPaymentIntentId(paymentIntentResponse.data.paymentIntentId);
        } catch (error) {
            console.error('Booking or Payment Error:', error);
            toast.error(error.response?.data?.error || 'Failed to create booking.');
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="loading"></div>
            </div>
        );
    }

    return (
        <div className="property-details">
            <h1 className="property-title">{property.name}</h1>
            <p className="property-location">Location: {property.location}</p>
            <p className="property-price">Price: ${property.price}</p>
            <p className="property-amenities">
                Amenities: {property.amenities.map((amenity) => amenity.toUpperCase()).join(', ')}
            </p>

            {property.vrImage && <VRView panoramaImage={property.vrImage} />}

            {pendingBooking ? (
                clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm
                            clientSecret={clientSecret}
                            paymentIntentId={paymentIntentId}
                            bookingId={pendingBooking._id}
                            navigate={navigate}
                        />
                    </Elements>
                ) : (
                    <p>Loading payment details...</p>
                )
            ) : (
                <>
                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="booking-input"
                        required
                    />
                    <button onClick={handleBooking} className="booking-button" disabled={isBooking}>
                        {isBooking ? <div className="loading small"></div> : 'Book Now'}
                    </button>
                </>
            )}
        </div>
    );
};

const CheckoutForm = ({ clientSecret, bookingId, navigate }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const updateBookingStatus = async () => {
        try {
            const response = await customFetch.put(
                `/api/bookings/update-status/${bookingId}`,
                { status: 'confirmed' },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            if (response.status === 200) {
                toast.success('Booking confirmed!');
                navigate('/my-bookings');
            } else {
                throw new Error('Failed to update booking status.');
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            toast.error('Failed to update booking status.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            toast.error('Stripe is not loaded yet. Please try again.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        setIsProcessing(true);

        try {
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                console.error('Payment Error:', error);
                toast.error(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                toast.success('Payment successful!');
                await updateBookingStatus();
            } else {
                console.warn('Unexpected PaymentIntent status:', paymentIntent.status);
            }
        } catch (error) {
            console.error('Payment Submission Error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <div className="card-element-container">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            </div>
            <button type="submit" className="payment-button" disabled={!stripe || isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default PropertyDetails;
