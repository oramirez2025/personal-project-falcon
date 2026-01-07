import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { payForOrder } from "../utilities";
import StripeCheckoutForm from "./StripeCheckoutForm"
import {   Dialog, Button, } from '@chakra-ui/react'

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

        // <Modal
        //     show={show}
        //     onHide={onClose}
        //     onShow={initializePayment}
        // >
        //     <ModalOverlay/>
        //     <ModalContent>
        //         <ModalHeader>
        //             {order.total}
        //         </ModalHeader>
        //     </ModalContent>

        // </Modal>





        <Dialog.Root
            show={show}
            onHide={onClose}
            onShow={initializePayment}
        >
            <Dialog.Header closeButton>
                <Dialog.Title>Pay for {order.id} </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
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
            </Dialog.Body>
            <Dialog.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
            </Dialog.Footer>
        </Dialog.Root>
    );
}
