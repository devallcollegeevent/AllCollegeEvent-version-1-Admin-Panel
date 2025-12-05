"use client";

import { getOrganizerEventsApi } from "@/lib/apiClient";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function isPastEvent(eventDate) {
  const today = new Date().setHours(0, 0, 0, 0);
  const eDate = new Date(eventDate).setHours(0, 0, 0, 0);
  return eDate < today;
}

export default function OrganizerEvents() {
  const { id } = useParams();
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getOrganizerEventsApi(id);
      setEvents(res.data?.events || []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Loading organizer events...</p>;

  return (
    <div>
      <h1>Events — Organizer ({id})</h1>

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
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                    No events found
                  </td>
                </tr>
              )}

              {events.map((event , indexValue) => (
                <tr
                  key={event.identity}
                  onClick={() => setPopup(event)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{indexValue+1}</td>
                  <td>{event.title}</td>
                  <td>{event.orgIdentity}</td>
                  <td>{event.venue || "Offline"}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.eventTime}</td>

                  <td onClick={(e) => e.stopPropagation()}>
                    {isPastEvent(ev.eventDate) ? (
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

          <div 
            style={{ textAlign: "right", marginTop: 20, cursor: "pointer" }}
            onClick={() => router.push("/admin/organisers")}
          >
            Go Back
          </div>
        </div>
      </div>
    </div>
  );
}
