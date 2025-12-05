"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOrganizersApi } from "@/lib/apiClient";

export default function OrganiserList() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Load organizers from API
  useEffect(() => {
    async function loadOrganizers() {
      const res = await getAllOrganizersApi();
      if (res.success) {
        setOrganizers(res.data.data || []); // API → data.data
      }
      setLoading(false);
    }
    loadOrganizers();
  }, []);

  // Open Add Modal
  const openAdd = () => {
    setEditMode(false);
    setModalData({
      organizationName: "",
      domainEmail: "",
      organizationCategory: "",
      country: "",
      state: "",
      city: "",
      isVerified: false,
    });
  };

  // Open Edit Modal
  const openEdit = (org) => {
    setEditMode(true);
    setModalData(org);
  };

  // Save/Add Organizer
  const saveOrganizer = () => {
    if (editMode) {
      // Update existing
      setOrganizers(
        organizers.map((o) =>
          o.identity === modalData.identity ? modalData : o
        )
      );
    } else {
      // Add new
      setOrganizers([
        ...organizers,
        { ...modalData, identity: Date.now() }, // temporary ID
      ]);
    }
    setModalData(null);
  };

  // Delete organizer
  const deleteOrganizer = (id) => {
    setOrganizers(organizers.filter((o) => o.identity !== id));
  };

  if (loading) return <p>Loading organizers...</p>;

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <h2>Organizer List</h2>
        <button className="btn btn-success" onClick={openAdd}>
          + Add Organizer
        </button>
      </div>

      {/* ORGANIZER TABLE */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Domain Email</th>
              <th>Category</th>
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>Verified</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {organizers.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-muted">
                  No organizers found
                </td>
              </tr>
            )}

            {organizers.map((org, index) => (
              <tr key={org.identity}>
                <td>{index + 1}</td>
                <td>{org.organizationName}</td>
                <td>{org.domainEmail}</td>
                <td>{org.organizationCategory}</td>
                <td>{org.country}</td>
                <td>{org.state}</td>
                <td>{org.city}</td>

                <td>
                  {org.isVerified ? (
                    <span className="text-success fw-bold">Verified</span>
                  ) : (
                    <span className="text-danger fw-bold">Not Verified</span>
                  )}
                </td>

                <td className="text-center">
                  <Link
                    href={`/admin/organisers/${org.identity}`}
                    className="btn btn-info btn-sm mx-1"
                  >
                    View Events
                  </Link>

                  <button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={() => openEdit(org)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => deleteOrganizer(org.identity)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL (ADD / EDIT) */}
      {modalData && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Organizer" : "Add Organizer"}
                </h5>
                <button className="btn-close" onClick={() => setModalData(null)}></button>
              </div>

              <div className="modal-body">
                {/* Input fields */}
                {[
                  ["organizationName", "Organization Name"],
                  ["domainEmail", "Domain Email"],
                  ["organizationCategory", "Category"],
                  ["country", "Country"],
                  ["state", "State"],
                  ["city", "City"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    className="form-control mb-2"
                    placeholder={label}
                    value={modalData[key]}
                    onChange={(e) =>
                      setModalData({ ...modalData, [key]: e.target.value })
                    }
                  />
                ))}

                {/* Verified Switch */}
                <div className="form-check form-switch mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={modalData.isVerified}
                    onChange={(e) =>
                      setModalData({ ...modalData, isVerified: e.target.checked })
                    }
                  />
                  <label className="form-check-label">Verified</label>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalData(null)}>Close</button>
                <button className="btn btn-success" onClick={saveOrganizer}>Save</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
