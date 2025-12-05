'use client';

import { getAllUsersApi } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const res = await getAllUsersApi();

      if (res.success) setUsers(res.data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1>User List</h1>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User id</th>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.data.map((userData) => (
                <tr key={userData.identity}>
                  <td>{userData.identity}</td>
                  <td>{userData.email}</td>
                  <td>{userData.name}</td>
                  <td>{userData.status}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
