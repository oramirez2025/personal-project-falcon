import { useEffect, useState } from "react"
import TicketCard from "../components/TicketCard"
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { stripeCheckout } from "../utilities";


function TicketsPage() {
    const [ticketA, setTicketA] = useState(0)
    const [ticketB, setTicketB] = useState(0)
    const [ticketC, setTicketC] = useState(0)
    const nav = useNavigate()

    // when the user is done choosing tickets, take them to Stripe for payment
    const handleClick = async () => {
        const cart = { typeA: ticketA, typeB: ticketB, typeC: ticketC };

        try {
            const stripeUrl = await stripeCheckout(cart);

            if (stripeUrl) {
                window.location.href = stripeUrl;
            }
        } catch (err) {
            nav("/tickets")
            alert("Something went wrong with the payment.");

        }
    };

    return (
        <div>
        <h2>Ticket Page</h2>

        <div className="d-flex flex-row gap-3 flex-wrap justify-content-center">
            <TicketCard title={"General Ticket"} price="$250.00" setTicketQty = {setTicketA} 
            description={'3 Days of TTRPGs, Tavern Feasts, Mixed Potions, Rare Merch, and Heroic Gift Bags'}/>
            <TicketCard title={"Community Ticket"} price="$400.00" setTicketQty = {setTicketB}
            description={'All General Admission perks + Shared On-Site Stay (hostel-style lodging)'}/>
            <TicketCard title={"Master Ticket"} price="$600.00" setTicketQty = {setTicketC}
            description={'All General Admission perks + A private chamber on-site (your sanctuary between sessions)'}/>
        </div>
        <Button variant="primary" type="submit" onClick={() => handleClick()}>
            Submit Order
        </Button>
        </div>
    );
}

export default TicketsPage;
