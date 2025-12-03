'use client';
import { useState } from "react";

// Helper: check if event date is past
function isPastEvent(eventDate) {
  const today = new Date().setHours(0, 0, 0, 0);
  const eDate = new Date(eventDate).setHours(0, 0, 0, 0);
  return eDate < today;  // TRUE → event finished
}

const initialEvents = [
  { 
    id: 1,
    name: "Music Night",
    orgName: "Organizer A",
    country: "India",
    state: "KA",
    city: "Bangalore",
    date: "2024-12-02",
    time: "19:00",
    status: "Approved"
  },
  { 
    id: 2,
    name: "Startup Expo",
    orgName: "Organizer B",
    country: "India",
    state: "TN",
    city: "Chennai",
    date: "2025-12-14",
    time: "10:00",
    status: "Pending"
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState(initialEvents);

  function updateStatus(id, newStatus) {
    const updated = events.map((ev) =>
      ev.id === id ? { ...ev, status: newStatus } : ev
    );
    setEvents(updated);
  }

  return (
    <div>
      <h1>Event List</h1>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event id</th>
                <th>Event name</th>
                <th>Organization Name</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status Change</th>
              </tr>
            </thead>

            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.name}</td>
                  <td>{ev.orgName}</td>
                  <td>{ev.country}</td>
                  <td>{ev.state}</td>
                  <td>{ev.city}</td>
                  <td>{ev.date}</td>
                  <td>{ev.time}</td>

                  {/* STATUS COLUMN */}
                  <td>
                    {isPastEvent(ev.date) ? (
                      <span style={{ color: "red", fontWeight: "600" }}>
                        Event Finished
                      </span>
                    ) : (
                      <select
                        value={ev.status}
                        onChange={(e) =>
                          updateStatus(ev.id, e.target.value)
                        }
                        style={{ padding: "6px", borderRadius: "6px" }}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Private">Private</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
