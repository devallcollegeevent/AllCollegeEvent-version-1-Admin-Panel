"use client";

import { getOrganizerEventsApi } from "@/lib/apiClient";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrganizerEvents() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

  function isPastEvent(eventDate) {
    const today = new Date().setHours(0, 0, 0, 0);
    const eDate = new Date(eventDate).setHours(0, 0, 0, 0);
    return eDate < today;
  }

  useEffect(() => {
    async function loadData() {
      const res = await getOrganizerEventsApi(id);
      console.log("==== API response:", res);

      if (res.success) {
        // FIX: safely extract array
        setEvents(res.data?.events || []);
      }

      setLoading(false);
    }

    loadData();
  }, [id]);

  const goBack = () =>{
      router.push("/admin/organisers");
  }

  if (loading) return <p>Loading organizer events...</p>;

  console.log("==== FINAL events:", events);

  return (
    <div>
      <h1>Events — Organizer ({id})</h1>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event id</th>
                <th>Event name</th>
                <th>Organization Name</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {/* IF NO EVENTS */}
              {events.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#888",
                    }}
                  >
                    No event created yet
                  </td>
                </tr>
              )}

              {/* IF EVENTS AVAILABLE */}
              {events.length > 0 &&
                events.map((ev) => (
                  <tr key={ev.identity}>
                    <td>{ev.identity}</td>
                    <td>{ev.title}</td>
                    <td>{ev.orgIdentity}</td>
                    <td>{ev.venue ? ev.venue : "Offline"}</td>
                    <td>{ev.eventDate}</td>
                    <td>{ev.eventTime}</td>

                    <td>
                      {isPastEvent(ev.eventDate) ? (
                        <span style={{ color: "red", fontWeight: 600 }}>
                          Event Finished
                        </span>
                      ) : (
                        <span>Upcoming</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div style={{textAlign:"end", marginTop:"20px",cursor:"pointer"}} onClick={goBack}>go to back</div>
        </div>
      </div>
    </div>
  );
}
