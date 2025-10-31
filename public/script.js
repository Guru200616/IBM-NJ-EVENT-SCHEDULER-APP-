const form = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');
const API_URL = '/api/events';

// Load events on page load
window.addEventListener('DOMContentLoaded', loadEvents);

async function loadEvents() {
  eventList.innerHTML = '<p>Loading events...</p>';
  const res = await fetch(API_URL);
  const events = await res.json();

  eventList.innerHTML = '';
  if (events.length === 0) {
    eventList.innerHTML = '<p>No upcoming events.</p>';
    return;
  }

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h3>${event.title}</h3>
      <small>${new Date(event.date).toLocaleString()}</small>
      <p>${event.description || ''}</p>
      <p><b>Location:</b> ${event.location || 'N/A'}</p>
      <p><b>Organizer:</b> ${event.organizer || 'N/A'}</p>
      <button class="delete-btn" onclick="deleteEvent('${event._id}')">Delete</button>
    `;
    eventList.appendChild(card);
  });
}

// Add new event
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newEvent = {
    title: form.title.value,
    description: form.description.value,
    date: form.date.value,
    location: form.location.value,
    organizer: form.organizer.value
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEvent)
  });

  if (res.ok) {
    form.reset();
    loadEvents();
  } else {
    alert('Error adding event');
  }
});

// Delete event
async function deleteEvent(id) {
  if (!confirm('Delete this event?')) return;

  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.ok) loadEvents();
}
