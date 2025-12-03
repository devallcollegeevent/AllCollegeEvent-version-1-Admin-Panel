"use client";

const users = [
  { id: 1, email: "user1@gmail.com", name: "Surya", status: "Active" },
  { id: 2, email: "user2@gmail.com", name: "Priya", status: "Blocked" },
];

export default function UsersPage() {
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.name}</td>
                  <td>{u.status}</td>
                  <td>
                    <button className="btn">Edit</button>{" "}
                    <button className="btn">Delete</button>
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
