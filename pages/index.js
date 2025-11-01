import Head from "next/head";
import { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    setLoading(true);
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function addEvent(event) {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", event }),
    });
    const json = await res.json();
    setEvents(json.events);
  }

  async function deleteEvent(id) {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    const json = await res.json();
    setEvents(json.events);
  }

  return (
    <div>
      <Head>
        <title>IBM-NJ Event Scheduler</title>
      </Head>
      <main className="container">
        <header className="hero">
          <h1>IBM-NJ Event Scheduler</h1>
          <p className="subtitle">
            Create, view, and manage your events easily
          </p>
        </header>

        <section className="grid">
          <EventForm onCreate={addEvent} />
          <div className="listWrap">
            <h2>Scheduled Events</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <EventList events={events} onDelete={deleteEvent} />
            )}
          </div>
        </section>

        <footer className="footer">
          <small>© 2025 IBM-NJ Event Scheduler</small>
        </footer>
      </main>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 40px auto;
          padding: 0 16px;
          font-family: "Inter", sans-serif;
        }
        .hero {
          text-align: center;
          margin-bottom: 28px;
        }
        h1 {
          font-size: 2.2rem;
          margin: 0;
        }
        .subtitle {
          color: #555;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .listWrap {
          background: #fff;
          padding: 16px;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(20, 20, 40, 0.06);
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
        }
        @media (max-width: 800px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
