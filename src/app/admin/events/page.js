'use client';

import { getAllEventsApi } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Past event checker
  function isPastEvent(eventDate) {
    const today = new Date().setHours(0, 0, 0, 0);
    const eDate = new Date(eventDate).setHours(0, 0, 0, 0);
    return eDate < today;
  }

  useEffect(() => {
    async function loadEvents() {
      const res = await getAllEventsApi();

      if (res.success) {
        setEvents(res.data);
      }
      setLoading(false);
    }

    loadEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  console.log("00000",events)

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
                <th>venue</th>
                <th>Date</th>
                <th>Time</th>
                <th>mode</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {events.events.map((events) => (
                <tr key={events.id}>
                  <td>{events.identity}</td>
                  <td>{events.title}</td>
                  <td>{events.orgIdentity}</td>
                  <td>{events.venue ? events.venue : "==="}</td>
                  <td>{events.eventDate}</td>
                  <td>{events.eventTime}</td>
                  <td>{events.mode}</td>

                  <td>
                    {isPastEvent(events.date) ? (
                      <span style={{ color: "red", fontWeight: 600 }}>
                        Event Finished
                      </span>
                    ) : (
                      <span>Upcoming Event ({events.eventDate})</span>
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
