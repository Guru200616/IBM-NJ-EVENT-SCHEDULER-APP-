import { v4 as uuidv4 } from "uuid";

let EVENTS = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ events: EVENTS });
  }

  if (req.method === "POST") {
    const { action } = req.body || {};

    if (action === "create") {
      const { event } = req.body;
      const newEvent = { id: uuidv4(), ...event };
      EVENTS = [newEvent, ...EVENTS];
      return res.status(200).json({ events: EVENTS });
    }

    if (action === "delete") {
      const { id } = req.body;
      EVENTS = EVENTS.filter((e) => e.id !== id);
      return res.status(200).json({ events: EVENTS });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
