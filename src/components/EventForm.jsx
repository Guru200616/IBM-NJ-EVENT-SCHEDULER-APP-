import React, { useState } from "react";

function EventForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert("Title and date are required!");
      return;
    }
    onAdd(form);
    setForm({ title: "", description: "", date: "", location: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        name="title"
        placeholder="Event title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      ></textarea>
      <button type="submit">Add Event</button>
    </form>
  );
