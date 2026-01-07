import { useEffect, useState } from "react"
import TicketCard from "../components/TicketCard"
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { Box, Grid, SimpleGrid } from "@chakra-ui/react";
import { createOrder, payForOrder } from "../utilities";
import PaymentModal from "../components/PaymentModal";

function TicketsPage() {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [order, setOrder] = useState(null)
    const [ticketA, setTicketA] = useState(0)
    const [ticketB, setTicketB] = useState(0)
    const [ticketC, setTicketC] = useState(0)
    const nav = useNavigate()

    // when the user is done choosing tickets, take them to Stripe for payment
    const handleClick = async () => {
        const cart = { typeA: ticketA, typeB: ticketB, typeC: ticketC };

        try {
            const data = await createOrder(cart);
            const createdOrder = data;
            setOrder(createdOrder);
            setShowPaymentModal(true);
            
        } catch (err) {
            nav("/tickets")
            alert("Something went wrong with the payment.");
        }
    };

    return (
        <div>
        <h2>Ticket Page</h2>


        <SimpleGrid columns={{ base: 1, md: 3}} spacing="6">
            <TicketCard title={"General Admission 🎟️"} price="$250.00" setTicketQty = {setTicketA} 
            description={'3 Days of TTRPGs, Tavern Feasts, Mixed Potions, Rare Merch, and Heroic Gift Bags.'}/>
            <TicketCard title={"Community Ticket 📜"} price="$400.00" setTicketQty = {setTicketB}
            description={'All General Admission perks + Shared On-Site Stay (hostel-style lodging included).'}/>
            <TicketCard title={"Master Upgrade 🎫"} price="$600.00" setTicketQty = {setTicketC}
            description={'All General Admission perks + A private chamber on-site (your sanctuary between sessions).'}/>
        </SimpleGrid>
        <Button variant="primary" type="button" onClick={() => handleClick()}>
            Submit Order
        </Button>


        <SimpleGrid columns={{ base: 1, md: 3}} spacing="6">
            <Card  className="rounded-sm" title="Card title"/>
        </SimpleGrid>

        
            {showPaymentModal && order && (
                <PaymentModal
                    show={showPaymentModal}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setOrder(null);
                    }}
                    order={order}
                />
            )}
        </div>
    );
}

export default TicketsPage;
