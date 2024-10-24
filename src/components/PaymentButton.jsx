import { useState } from 'react';
import customFetch from '../../utils/api';

const PaymentButton = ({ property }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!property || !property.name || !property.price) {
            alert('Invalid property details');
            return;
        }

        setLoading(true);
        try {
            const { data } = await customFetch.post('/api/payments/create-checkout-session', { property });
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('Checkout session URL not found');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="btn-primary"
        >
            {loading ? 'Processing...' : 'Book Now'}
        </button>
    );
};

export default PaymentButton;
