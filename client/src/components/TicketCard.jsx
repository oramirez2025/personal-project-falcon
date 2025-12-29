function TicketCard({title, price, setTicketQty, description}) {
  return (
    <div className="card" style={{ width: "18rem" }}>
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          {description}
        </p>
        {/* Change Quantity */}
        <div>
            <p>Price: {price}</p>
            <input type="number" 
                   id="quantity" 
                   name="quantity" 
                   min="0"
                   onChange={(e) => setTicketQty(e.target.value)}
            />
        </div>
      </div>
    </div>
  );
}

export default TicketCard;