import React from "react";

function EventList({ events, onDelete }) {
  if (!events.length) {
    return <p>No events yet. Add one!</p>;
  }

  return (
    <div className="event-list">
      {events.map((ev) => (
        <div className="event-card" key={ev.id}>
          <h3>{ev.title}</h3>
          <p>{new Date(ev.date).toLocaleString()}</p>
          <p>{ev.location}</p>
          <p>{ev.description}</p>
          <button onClick={() => onDelete(ev.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default EventList;
