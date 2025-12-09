"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSingleEventApi } from "@/lib/apiClient";
import { getAllEventsApi } from "@/lib/apiClient";

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await getAllEventsApi();
        const allEvents = all?.data?.data || [];

        const selected = allEvents.find((ev) => ev.identity === id);

        if (!selected) {
          setEvent(null);
          setLoading(false);
          return;
        }

        const res = await getSingleEventApi(id);
        setEvent(res?.data?.data || null);
      } catch (err) {
        console.error("Error loading event:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    try {
      load();
    } catch (err) {
      console.error("Effect error:", err);
    }
  }, [id]);

  if (loading) return <p className="p-4">Loading event...</p>;
  if (!event) return <p className="p-4">Event not found.</p>;

  return (
    <div className="container mt-4">
      <button
        className="btn btn-dark mb-3"
        onClick={() => {
          try {
            router.back();
          } catch (err) {
            console.error("Back navigation error:", err);
          }
        }}
      >
        ← Back
      </button>

      <div className="card p-4">
        <img
          src={event.bannerImage}
          alt="Event Image"
          style={{
            height: "472px",
            borderRadius: "8px",
            background: "black",
            padding: "6px 159px",
          }}
        />

        <h2 className="mt-4">{event.title}</h2>

        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="mt-5"
        >
          <div>
            <p>
              <b>Description:</b> {event.description ?? "No description"}
            </p>
            <p>
              <b>Organizer:</b> {event.orgIdentity}
            </p>
          </div>

          <div>
            <p>
              <b>Venue:</b> {event.venue}
            </p>
            <p>
              <b>Date:</b> {event.eventDate}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>
              <b>Time:</b> {event.eventTime}
            </p>
            <p>
              <b>Mode:</b> {event.mode}
            </p>
          </div>

          <div>
            <p>
              <b>Status:</b> {event.status ? event.status : "no"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
