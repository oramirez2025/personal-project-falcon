import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import CreateEventModal from "../components/CreateEventModal";
import EditEventModal from "../components/EditEventModal";
import EventCard from "../components/EventCard";
import { fetchEvents, createEvents, deleteEvent, updateEvent, userConfirmation } from "../utilities";
import HeroicHall from "../assets/HeroicHall.jpeg";
import WeatherCard from "../components/WeatherCard";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchEvents(setEvents);
  }, []);

  useEffect(() => {
    const restoreUser = async () => {
      const confirmedUser = await userConfirmation();
      setUser(confirmedUser);
    };
    restoreUser();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async (data) => {
    await createEvents(setEvents, data);
  };

  const handleUpdate = async (id, data) => {
    await updateEvent(setEvents, id, data);
  };

  const handleDelete = async (id) => {
    await deleteEvent(setEvents, id);
  };

  return (
    <>
      
      <div
        className="hero-section d-flex align-items-center justify-content-center weathercolor"
        style={{
          backgroundImage: `url(${HeroicHall})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '45vh'
        }}
      >
        <h1 className="text-white"></h1>
        <WeatherCard/>
      </div>

      <h2>Events</h2>

      <Button variant="primary" onClick={handleShow}>
        Add an Event
      </Button>

      <CreateEventModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
      />

      <EditEventModal
        show={showEdit}
        handleClose={() => setShowEdit(false)}
        event={editingEvent}
        handleUpdate={handleUpdate}
      />

      <div className="events-container">
        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            day={event.day}
            start_time={event.start_time}
            end_time={event.end_time}
            location={event.location}
            description={event.description}
            onClickDelete={() => handleDelete(event.id)}
            onClickUpdate={() => {
              setEditingEvent(event);
              setShowEdit(true);
            }}
          />
        ))}
      </div>
    </>
  );
}
