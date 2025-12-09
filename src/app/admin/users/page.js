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

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllUsersApi();
        if (res.success) {
          setUsers(res.data?.data || []);
        }
      } catch (err) {
        console.error("User load failed:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    try {
      load();
    } catch (err) {
      console.error("useEffect error:", err);
    }
  }, []);

  const openAdd = () => {
    try {
      setEditMode(false);
      setModalData({ email: "", name: "", password: "", status: "" });
    } catch (err) {
      console.error("openAdd error:", err);
    }
  };

  const openEdit = (user) => {
    try {
      setEditMode(true);
      setModalData(user);
    } catch (err) {
      console.error("openEdit error:", err);
    }
  };

  const saveUser = async () => {
    try {
      const body = {
        email: modalData.email,
        name: modalData.name,
        password: modalData.password,
        type: "user",
      };

      if (editMode) {
        const updateBody = {
          email: modalData.email,
          name: modalData.name,
          password: modalData.password,
        };

        const res = await updateUserApi(modalData.identity, updateBody);

        if (res.success) {
          setUsers(
            users.map((u) =>
              u.identity === modalData.identity ? { ...u, ...updateBody } : u
            )
          );
        } else {
          alert("Update failed: " + res.message);
        }
      } else {
        const res = await createUserApi(body);

        if (res.success) {
          setUsers([...users, res.data?.user]);
        } else {
          alert("Create failed: " + res.message);
        }
      }

      setModalData("");
    } catch (err) {
      console.error("saveUser error:", err);
      alert("Something went wrong while saving user");
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await deleteUserApi(id);

      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.identity !== id));
        console.log("User deleted");
      } else {
        console.log("Delete failed:", res.message);
      }
    } catch (err) {
      console.error("deleteUser error:", err);
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

            {users.map((user) => (
              <tr key={user?.identity || "no-id"}>
                <td>{user?.identity || "No ID"}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>Active</td>

                <td className="text-center">
                  <button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={() => {
                      try {
                        openEdit(user);
                      } catch (err) {
                        console.error("Edit click error:", err);
                      }
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => {
                      try {
                        deleteUser(user.identity);
                      } catch (err) {
                        console.error("Delete click error:", err);
                      }
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
                <button className="btn-close" onClick={() => setModalData("")}></button>
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
                <button className="btn btn-secondary" onClick={() => setModalData("")}>
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
