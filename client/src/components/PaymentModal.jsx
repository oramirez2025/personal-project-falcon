import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { payForTickets } from "../utilities";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// TO-DO: Rough template. Will need changed based off order model and/or naming conventions.
export default function PaymentModal({ show, onClose, }) {
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    const initializePayment = async () => {
        setLoading(true);
        try {
            const paymentData = await payForTickets(ticket.id, { amount: ticket.price });
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
                <Modal.Title>Pay for {ticket.amount} {ticket.ticket_profile} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Tickets:</strong> {new ticket.ticket_profile.title}</p>
                <p><strong>Price:</strong> ${ticket.price}</p>
                {clientSecret && (
                    <Elements stripe={stripePromise}>
                        <StripeCheckoutForm
                            clientSecret={clientSecret}
                            paymentId={ticket.paymentId}
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
