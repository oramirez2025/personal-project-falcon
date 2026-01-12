import { Table } from "@chakra-ui/react";

export default function TicketsTable({ orders }) {
  // Flatten orders into individual ticket rows
  const ticketRows = orders.flatMap(order =>
    order.items.map(item => ({
      id: item.id,
      ticketType: item.ticket_type,
      title: item.title_at_purchase,
      quantity: item.quantity,
      price: item.line_total,
      purchaseDate: new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      orderId: order.id,
    }))
  );

  return (
    <Table.Root size="sm" variant="outline" interactive>
      <Table.Header>
        <Table.Row bg="forge.gold.900">
          <Table.ColumnHeader color="forge.gold.400">Ticket Type</Table.ColumnHeader>
          <Table.ColumnHeader color="forge.gold.400">Quantity</Table.ColumnHeader>
          <Table.ColumnHeader color="forge.gold.400">Price</Table.ColumnHeader>
          <Table.ColumnHeader color="forge.gold.400">Purchase Date</Table.ColumnHeader>
          <Table.ColumnHeader color="forge.gold.400">Order #</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {ticketRows.map((ticket) => (
          <Table.Row key={ticket.id}>
            <Table.Cell color="white" fontWeight="medium">
              {ticket.title}
            </Table.Cell>
            <Table.Cell color="gray.300">{ticket.quantity}</Table.Cell>
            <Table.Cell color="forge.gold.400" fontWeight="semibold">
              ${parseFloat(ticket.price).toFixed(2)}
            </Table.Cell>
            <Table.Cell color="gray.300">{ticket.purchaseDate}</Table.Cell>
            <Table.Cell color="gray.400" fontSize="sm">
              #{ticket.orderId}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
