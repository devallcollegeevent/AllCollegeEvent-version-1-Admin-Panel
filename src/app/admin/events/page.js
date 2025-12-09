"use client";

import { useState, useEffect } from "react";
import {
  createEventApi,
  updateEventApi,
  deleteEventApi,
  getAllEventsApi,
} from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [modalData, setModalData] = useState("");
  const [editMode, setEditMode] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllEventsApi();
        setEvents(res.data?.data || []);
      } catch (err) {
        console.error("Load events error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openAdd = () => {
    try {
      setEditMode(false);
      setModalData({
        event_title: "",
        description: "",
        event_date: "",
        event_time: "",
        mode: "",
        venue: "",
        org_id: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item) => {
    try {
      if (!item) return;
      setEditMode(true);
      setModalData({
        identity: item.identity,
        event_title: item.title ?? "",
        description: item.description ?? "",
        event_date: item.eventDate ?? "",
        event_time: item.eventTime ?? "",
        mode: item.mode ?? "",
        venue: item.venue ?? "",
        org_id: item.orgIdentity ?? "",
        image: null,
      });
    } catch (err) {
      console.error("Open edit error:", err);
    }
  };

  const saveEvent = async () => {
    try {
      const form = new FormData();
      form.append("event_title", modalData?.event_title ?? "");
      form.append("description", modalData?.description ?? "");
      form.append("event_date", modalData?.event_date ?? "");
      form.append("event_time", modalData?.event_time ?? "");
      form.append("mode", modalData?.mode ?? "");
      form.append("venue", modalData?.venue ?? "");
      form.append("org_id", modalData?.org_id ?? "");
      if (modalData?.image) form.append("image", modalData.image);

      if (editMode) {
        const res = await updateEventApi(
          modalData.org_id,
          modalData.identity,
          form
        );

        if (res.success) {
          const updatedEvent = {
            identity: modalData.identity,
            title: modalData.event_title,
            description: modalData.description ?? "",
            eventDate: modalData.event_date,
            eventTime: modalData.event_time,
            venue: modalData.venue,
            mode: modalData.mode,
            orgIdentity: modalData.org_id,
          };
          setEvents(
            events.map((e) =>
              e.identity === updatedEvent.identity ? updatedEvent : e
            )
          );
        } else {
          alert("Update failed: " + res.message);
        }

        setModalData("");
        return;
      }

      const res = await createEventApi(modalData.org_id, form);
      if (res.success) {
        setEvents([...events, res.data.data]);
      } else {
        alert("Failed to create event: " + res.message);
      }

      setModalData("");
    } catch (err) {
      console.error("Save event error:", err);
      alert("Error saving event");
    }
  };

  const openDeleteConfirm = (ev) => {
    try {
      setToDelete({
        identity: ev.identity,
        orgIdentity: ev.orgIdentity,
        title: ev.title,
      });
      setConfirmPopUp(true);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      if (!toDelete) return;

      const res = await deleteEventApi(toDelete.orgIdentity, toDelete.identity);

      if (res.success) {
        setEvents((prev) => prev.filter((e) => e.identity !== toDelete.identity));
        setConfirmPopUp(false);
        setToDelete(null);
      } else {
        alert("Delete failed: " + res.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting event");
    }
  };

  const cancelDelete = () => {
    try {
      setConfirmPopUp(false);
      setToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const goToEvent = (event) => {
    try {
      router.push(`/admin/events/${event.identity}`);
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  const updateStatus = (eventId, newStatus) => {
    try {
      setEvents(
        events.map((ev) =>
          ev.identity === eventId ? { ...ev, status: newStatus } : ev
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Event List</h2>
        <button className="btn btn-success" onClick={openAdd}>
          + Add Event
        </button>
      </div>

      {/* TABLE */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Event Name</th>
              <th>Organizer</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Time</th>
              <th>Mode</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, indexValue) => (
              <tr
                key={event.identity}
                onClick={() => goToEvent(event)}
                style={{ cursor: "pointer" }}
              >
                <td>{indexValue + 1}</td>
                <td>{event.title}</td>
                <td>{event.orgIdentity}</td>
                <td>{event.venue ? event.venue : "====="}</td>
                <td>{event.eventDate}</td>
                <td>{event.eventTime}</td>
                <td>{event.mode}</td>

                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    className="form-select form-select-sm"
                    value={event.status ?? "draft"}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      try {
                        e.stopPropagation();
                        updateStatus(event.identity, e.target.value);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="private">Private</option>
                    <option value="reject">Reject</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(event);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirm(event);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS — SAME, NO CHANGES */}
      {modalData && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          {/* modal content unchanged */}
        </div>
      )}

      {confirmPopUp && toDelete && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          {/* delete modal unchanged */}
        </div>
      )}
    </div>
  );
}
