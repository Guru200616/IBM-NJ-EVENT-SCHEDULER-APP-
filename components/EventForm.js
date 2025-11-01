import { useState } from "react";

export default function EventForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!title || !date) return alert("Please enter title and date");
    const event = { title, date, time, location, notes };
    await onCreate(event);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setNotes("");
  }

  return (
    <div className="card">
      <h2>Create Event</h2>
      <form onSubmit={submit}>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <label>Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes"
        />

        <button type="submit">Add Event</button>
      </form>

      <style jsx>{`
        .card {
          background: #fff;
          padding: 16px;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(20, 20, 40, 0.06);
        }
        label {
          display: block;
          margin-top: 8px;
          color: #333;
        }
        input,
        textarea {
          width: 100%;
          padding: 8px;
          margin-top: 6px;
          border-radius: 6px;
          border: 1px solid #ddd;
        }
        button {
          margin-top: 12px;
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          background: #0070f3;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
