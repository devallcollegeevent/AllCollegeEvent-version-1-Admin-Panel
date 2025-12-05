"use client";

import { getAllEventsApi } from "@/lib/apiClient";
import { useEffect, useState } from "react";

function isPastEvent(eventDate) {
  const today = new Date().setHours(0, 0, 0, 0);
  const eDate = new Date(eventDate).setHours(0, 0, 0, 0);
  return eDate < today;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      const res = await getAllEventsApi();
      if (res.success) setEvents(res.data?.events || []);
      setLoading(false);
    }
    loadEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div>
      <h1>Event List</h1>

      {popup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>{popup.title}</h2>

            <p><strong>Organization:</strong> {popup.orgIdentity}</p>
            <p><strong>Venue:</strong> {popup.venue || "Offline"}</p>
            <p><strong>Date:</strong> {popup.eventDate}</p>
            <p><strong>Time:</strong> {popup.eventTime}</p>
            <p><strong>Mode:</strong> {popup.mode}</p>

            <button className="popup-close-btn" onClick={() => setPopup(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Event name</th>
                <th>Organization</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event, indexValue) => (
                <tr
                  key={event.identity}
                  style={{ cursor: "pointer" }}
                  onClick={() => setPopup(event)}
                >
                  <td>{indexValue+1}</td>
                  <td>{event.title}</td>
                  <td>{event.orgIdentity}</td>
                  <td>{event.venue || "---"}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.eventTime}</td>
                  <td>{event.mode}</td>

                  <td onClick={(e) => e.stopPropagation()}>
                    {isPastEvent(event.eventDate) ? (
                      <span style={{ color: "red", fontWeight: 600 }}>
                        Finished
                      </span>
                    ) : (
                      <span>Upcoming</span>
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
