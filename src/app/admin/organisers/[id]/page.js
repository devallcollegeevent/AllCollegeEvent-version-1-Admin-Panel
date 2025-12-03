'use client';
import { useParams } from "next/navigation";
import { useState } from "react";

// Helper function – Past event check
function isPastEvent(eventDate) {
  const today = new Date().setHours(0, 0, 0, 0);
  const eDate = new Date(eventDate).setHours(0, 0, 0, 0);
  return eDate < today;
}

const eventsData = {
  1: [
    { 
      id: 101,
      name: "Tech Fest",
      orgName: "Organizer A",
      country: "India",
      state: "TN",
      city: "CBE",
      date: "2024-12-10",
      time: "10:00",
      status: "Approved"
    },
    { 
      id: 102,
      name: "Design Expo",
      orgName: "Organizer A",
      country: "India",
      state: "TN",
      city: "CBE",
      date: "2024-11-15",
      time: "14:00",
      status: "Draft"
    }
  ],

  2: [
    { 
      id: 201,
      name: "Sydney Meetup",
      orgName: "Organizer B",
      country: "Australia",
      state: "NSW",
      city: "Sydney",
      date: "2025-01-20",
      time: "18:00",
      status: "Pending"
    }
  ]
};

export default function OrganiserEvents() {
  const { id } = useParams();
  const [events, setEvents] = useState(eventsData[id] || []);

  function updateStatus(eventId, newStatus) {
    const updated = events.map((ev) =>
      ev.id === eventId ? { ...ev, status: newStatus } : ev
    );
    setEvents(updated);
  }

  return (
    <div>
      <h1>Events — Organizer {id}</h1>

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
