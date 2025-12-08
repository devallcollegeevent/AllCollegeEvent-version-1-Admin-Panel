"use client";

import { useState, useEffect } from "react";
import {
  createEventApi,
  updateEventApi,
  deleteEventApi,
  getAllEventsApi,
} from "@/lib/apiClient";
import { useRouter } from "next/navigation";

function isPast(date) {
  const today = new Date().setHours(0, 0, 0, 0);
  return new Date(date).setHours(0, 0, 0, 0) < today;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [modalData, setModalData] = useState("");
  const [editMode, setEditMode] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // confirm modal state
  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // LOAD EVENTS
  useEffect(() => {
    async function load() {
      const res = await getAllEventsApi();
      setEvents(res.data?.data || []);
      setLoading(false);
    }
    load();
  }, []);

  /* ===========================
     OPEN ADD
  =========================== */
  const openAdd = () => {
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
  };

  /* ===========================
     OPEN EDIT
  =========================== */
  const openEdit = (item) => {
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
  };

  /* ===========================
     SAVE EVENT (CREATE / UPDATE)
  =========================== */
  const saveEvent = async () => {
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
  };

  /* ===========================
     DELETE: open confirm modal (UI)
     and actual delete function
  =========================== */
  const openDeleteConfirm = (ev) => {
    // ev should be the event object from the list
    setToDelete({
      identity: ev.identity,
      orgIdentity: ev.orgIdentity,
      title: ev.title,
    });
    setConfirmPopUp(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    // call API
    const res = await deleteEventApi(toDelete.orgIdentity, toDelete.identity);

    if (res.success) {
      // remove from UI
      setEvents((prev) => prev.filter((e) => e.identity !== toDelete.identity));
      setConfirmPopUp(false);
      setToDelete(null);
    } else {
      alert("Delete failed: " + res.message);
    }
  };

  const cancelDelete = () => {
    setConfirmPopUp(false);
    setToDelete(null);
  };

  const goToEvent = (event) => {
    router.push(`/admin/events/${event.identity}`);
  };

  const updateStatus = (eventId, newStatus) => {
    setEvents(
      events.map((ev) =>
        ev.identity === eventId ? { ...ev, status: newStatus } : ev
      )
    );
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
                    onClick={(e) => e.stopPropagation()} // ← IMPORTANT FIX
                    onChange={(e) => {
                      e.stopPropagation();
                      updateStatus(event.identity, e.target.value);
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

      {/* EDIT / CREATE MODAL */}
      {modalData && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Event" : "Add Event"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalData("")}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Event Title"
                  value={modalData?.event_title ?? ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, event_title: e.target.value })
                  }
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={modalData?.description ?? ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, description: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Organizer ID"
                  value={modalData?.org_id ?? ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, org_id: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Venue"
                  value={modalData?.venue ?? ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, venue: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  value={modalData?.event_date ?? ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, event_date: e.target.value })
                  }
                />

                <input
                  type="time"
                  className="form-control mb-2"
                  value={modalData?.event_time ?? ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, event_time: e.target.value })
                  }
                />

                <select
                  className="form-control mb-2"
                  value={modalData?.mode ?? ""}
                  onChange={(e) =>
                    setModalData({ ...modalData, mode: e.target.value })
                  }
                >
                  <option value="">Select Mode</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>

                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setModalData({ ...modalData, image: e.target.files[0] })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalData("")}
                >
                  Close
                </button>
                <button className="btn btn-success" onClick={saveEvent}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmPopUp && toDelete && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={cancelDelete}></button>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to delete the event:</p>
                <p>
                  <strong>{toDelete.title}</strong>
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
                <button className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
