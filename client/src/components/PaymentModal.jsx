import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { payForOrder } from "../utilities";
import StripeCheckoutForm from "./StripeCheckoutForm"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log("VITE_STRIPE_PUBLISHABLE_KEY =", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export default function PaymentModal({ show, onClose, order }) {
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    

    const initializePayment = async () => {
        if (!order.id) return;
        setLoading(true);
        try {
            const paymentData = await payForOrder(order.id);
            setClientSecret(paymentData.client_secret);
        } catch (err) {
            console.error(err);
            alert("Failed to initialize payment.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            onShow={initializePayment}
        >
            <Modal.Header closeButton>
                <Modal.Title>Pay for {order.id} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Tickets:</strong> {order.id}</p>
                <p><strong>Price:</strong> ${order.id}</p>
                {clientSecret && (
                    <Elements stripe={stripePromise}>
                        <StripeCheckoutForm
                            clientSecret={clientSecret}
                            paymentId={order.paymentId}
                            onSuccess={onClose}
                        />
                    </Elements>
                )}

                {loading && <p>Loading payment form...</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
}
