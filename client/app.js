// Basic client app using fetch to API
const apiBase = '/api';
let token = localStorage.getItem('token') || null;
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
const calendarEl = document.getElementById('calendar');
let calendar = null;
let editingEventId = null;

const els = {
  registerBtn: document.getElementById('registerBtn'),
  loginBtn: document.getElementById('loginBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  nameInput: document.getElementById('name'),
  emailInput: document.getElementById('email'),
  passInput: document.getElementById('password'),
  appDiv: document.getElementById('app'),
  authDiv: document.getElementById('auth'),
  newEventBtn: document.getElementById('newEventBtn'),
  eventModal: document.getElementById('eventModal'),
  modalTitle: document.getElementById('modalTitle'),
  evTitle: document.getElementById('evTitle'),
  evDesc: document.getElementById('evDesc'),
  evStart: document.getElementById('evStart'),
  evEnd: document.getElementById('evEnd'),
  evReminder: document.getElementById('evReminder'),
  saveEventBtn: document.getElementById('saveEventBtn'),
  deleteEventBtn: document.getElementById('deleteEventBtn'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  userDisplay: document.getElementById('userDisplay'),
  eventsList: document.getElementById('eventsList')
};

function setAuth(tokenVal, user) {
  token = tokenVal;
  currentUser = user;
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    els.logoutBtn.style.display = '';
    els.authDiv.style.display = 'none';
    els.appDiv.style.display = '';
    els.userDisplay.innerText = user?.name || user?.email;
    initCalendar();
    loadEvents();
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    els.logoutBtn.style.display = 'none';
    els.authDiv.style.display = '';
    els.appDiv.style.display = 'none';
    if (calendar) {
      calendar.destroy();
      calendar = null;
    }
  }
}

function apiFetch(path, opts = {}) {
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(apiBase + path, { ...opts, headers });
}

// Auth handlers
els.registerBtn.onclick = async () => {
  const name = els.nameInput.value.trim();
  const email = els.emailInput.value.trim();
  const password = els.passInput.value;
  if (!email || !password) return alert('Email and password required');
  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) return alert(data.message || 'Register failed');
  setAuth(data.token, data.user);
};

els.loginBtn.onclick = async () => {
  const email = els.emailInput.value.trim();
  const password = els.passInput.value;
  if (!email || !password) return alert('Email and password required');
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) return alert(data.message || 'Login failed');
  setAuth(data.token, data.user);
};

els.logoutBtn.onclick = () => {
  setAuth(null, null);
};

// Calendar & events
function initCalendar() {
  if (calendar) return;
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
    events: [],
    eventClick: info => {
      openEditEvent(info.event);
    },
    dateClick: info => {
      openNewEventForDate(info.dateStr);
    }
  });
  calendar.render();
}

async function loadEvents() {
  const res = await apiFetch('/events');
  if (!res.ok) {
    const data = await res.json();
    return alert(data.message || 'Could not load events');
  }
  const events = await res.json();
  calendar.removeAllEvents();
  els.eventsList.innerHTML = '';
  events.forEach(ev => {
    calendar.addEvent({
      id: ev._id,
      title: ev.title,
      start: ev.start,
      end: ev.end || null,
      extendedProps: { description: ev.description || '', reminderMinutesBefore: ev.reminderMinutesBefore || 30 }
    });
    const item = document.createElement('div');
    item.className = 'event-item';
    item.innerHTML = `<strong>${ev.title}</strong><div>${new Date(ev.start).toLocaleString()}${ev.end ? ' - ' + new Date(ev.end).toLocaleString() : ''}</div>`;
    item.onclick = () => openEditEventFromList(ev);
    els.eventsList.appendChild(item);
  });
}

function openModal() {
  els.eventModal.style.display = '';
}
function closeModal() {
  els.eventModal.style.display = 'none';
  editingEventId = null;
  els.deleteEventBtn.style.display = 'none';
  els.modalTitle.innerText = 'New Event';
  els.evTitle.value = '';
  els.evDesc.value = '';
  els.evStart.value = '';
  els.evEnd.value = '';
  els.evReminder.value = '';
}

els.newEventBtn.onclick = () => {
  openNewEventForDate();
};

function openNewEventForDate(dateStr) {
  editingEventId = null;
  els.modalTitle.innerText = 'New Event';
  if (dateStr) {
    const d = new Date(dateStr);
    els.evStart.value = toDateTimeLocal(d);
  }
  openModal();
}

function openEditEvent(fcEvent) {
  editingEventId = fcEvent.id;
  els.modalTitle.innerText = 'Edit Event';
  els.deleteEventBtn.style.display = '';
  els.evTitle.value = fcEvent.title;
  els.evStart.value = toDateTimeLocal(new Date(fcEvent.start));
  els.evEnd.value = fcEvent.end ? toDateTimeLocal(new Date(fcEvent.end)) : '';
  els.evDesc.value = fcEvent.extendedProps?.description || '';
  apiFetch('/events/' + fcEvent.id).then(r => r.json()).then(ev => {
    if (ev.reminderMinutesBefore) els.evReminder.value = ev.reminderMinutesBefore;
  }).catch(()=>{});
  openModal();
}

function openEditEventFromList(ev) {
  editingEventId = ev._id;
  els.modalTitle.innerText = 'Edit Event';
  els.deleteEventBtn.style.display = '';
  els.evTitle.value = ev.title;
  els.evDesc.value = ev.description || '';
  els.evStart.value = toDateTimeLocal(new Date(ev.start));
  els.evEnd.value = ev.end ? toDateTimeLocal(new Date(ev.end)) : '';
  els.evReminder.value = ev.reminderMinutesBefore || 30;
  openModal();
}

function toDateTimeLocal(date) {
  const dt = new Date(date);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0,16);
}

els.saveEventBtn.onclick = async () => {
  const payload = {
    title: els.evTitle.value,
    description: els.evDesc.value,
    start: els.evStart.value ? new Date(els.evStart.value).toISOString() : null,
    end: els.evEnd.value ? new Date(els.evEnd.value).toISOString() : null,
    reminderMinutesBefore: Number(els.evReminder.value || 30)
  };
  if (!payload.title || !payload.start) return alert('Title and start required');
  try {
    let res;
    if (editingEventId) {
      res = await apiFetch('/events/' + editingEventId, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      res = await apiFetch('/events', { method: 'POST', body: JSON.stringify(payload) });
    }
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error saving');
    closeModal();
    loadEvents();
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
};

els.deleteEventBtn.onclick = async () => {
  if (!editingEventId) return;
  if (!confirm('Delete event?')) return;
  const res = await apiFetch('/events/' + editingEventId, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) return alert(data.message || 'Delete failed');
  closeModal();
  loadEvents();
};

els.closeModalBtn.onclick = closeModal;

// Init
setAuth(token, currentUser);
