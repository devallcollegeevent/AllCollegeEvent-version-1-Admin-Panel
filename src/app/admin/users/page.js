"use client";

import {
  getAllUsersApi,
  updateUserApi,
  deleteUserApi,
  createUserApi,
} from "@/lib/apiClient";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [modalData, setModalData] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // ============================
  // LOAD USERS FROM BACKEND
  // ============================
  useEffect(() => {
    async function load() {
      const res = await getAllUsersApi();
      if (res.success) {
        setUsers(res.data.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  // ============================
  // OPEN ADD MODAL
  // ============================
  const openAdd = () => {
    setEditMode(false);
    setModalData({ email: "", name: "", password: "", status: "" });
  };

  // ============================
  // OPEN EDIT MODAL
  // ============================
  const openEdit = (user) => {
    setEditMode(true);
    setModalData(user);
  };

  // ============================
  // SAVE USER (UPDATE ONLY)
  // ============================
  const saveUser = async () => {
    const body = {
      email: modalData.email,
      name: modalData.name,
      password: modalData.password,
      type: "user",
      // status: modalData.status,
    };

    if (editMode) {
      const body = {
        email: modalData.email,
        name: modalData.name,
        password: modalData.password,
      };
      // UPDATE USER
      console.log("modalData", modalData);
      const res = await updateUserApi(modalData.identity, body);

      if (res.success) {
        setUsers(
          users.map((u) =>
            u.identity === modalData.identity ? { ...u, ...body } : u
          )
        );
      } else {
        alert("Update failed: " + res.message);
      }
    } else {
      // CREATE USER
      const res = await createUserApi(body);

      if (res.success) {
        setUsers([...users, res.data.user]); // backend returns created user
      } else {
        alert("Create failed: " + res.message);
      }
    }

    setModalData("");
  };

  // ============================
  // DELETE USER
  // ============================
  const deleteUser = async (id) => {
    const res = await deleteUserApi(id);

    if (res.success) {
      console.log("deleted user")
    } else {
      console.log("responce",res.message)
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>User List</h2>
        <button className="btn btn-success" onClick={openAdd}>
          + Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-muted">
                  No users found
                </td>
              </tr>
            )}

            {users.map((u) => (
              <tr key={u.identity}>
                <td>{u.identity}</td>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>Active</td>

                <td className="text-center">
                  <button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={() => openEdit(u)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => deleteUser(u.identity)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalData && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit User" : "Add User"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalData("")}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={modalData.email}
                  onChange={(e) =>
                    setModalData({ ...modalData, email: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={modalData.name}
                  onChange={(e) =>
                    setModalData({ ...modalData, name: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Enter a password"
                  value={modalData.password}
                  onChange={(e) =>
                    setModalData({ ...modalData, password: e.target.value })
                  }
                />

                <select
                  className="form-control"
                  value={modalData.status}
                  onChange={(e) =>
                    setModalData({ ...modalData, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalData("")}
                >
                  Close
                </button>
                <button className="btn btn-success" onClick={saveUser}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
