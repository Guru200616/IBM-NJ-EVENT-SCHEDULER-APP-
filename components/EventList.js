export default function EventList({ events = [], onDelete }) {
  if (!events.length) return <p>No events yet.</p>;

  return (
    <ul className="events">
      {events.map((ev) => (
        <li key={ev.id} className="event">
          <div className="meta">
            <strong>{ev.title}</strong>
            <div className="when">
              {ev.date} {ev.time ? `· ${ev.time}` : ""}
            </div>
            {ev.location && <div className="loc">{ev.location}</div>}
            {ev.notes && <div className="notes">{ev.notes}</div>}
          </div>
          <button className="del" onClick={() => onDelete(ev.id)}>
            Delete
          </button>
        </li>
      ))}

      <style jsx>{`
        .events {
          list-style: none;
          padding: 0;
        }
        .event {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .del {
          background: transparent;
          border: 1px solid #e00;
          color: #e00;
          padding: 6px 10px;
          border-radius: 6px;
        }
      `}</style>
    </ul>
  );
}
