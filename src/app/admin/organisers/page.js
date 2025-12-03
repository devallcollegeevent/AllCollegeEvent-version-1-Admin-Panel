'use client';
import Link from "next/link";

const organisers = [
  { id:1, name:"Organizer A", country:"India", state:"TN", city:"CBE", eventCount:3, status:"Active", domainId: "org-a" },
  { id:2, name:"Organizer B", country:"Australia", state:"NSW", city:"Sydney", eventCount:1, status:"Pending", domainId: "org-b" },
];

export default function OrganiserList() {
  return (
    <div>
      <h1>Organiser List</h1>

      <div className="card" style={{ marginTop:20 }}>
        <div className="table-wrap">
          <table>
            <thead id="table-heading">
              <tr >
                <th>Organiser id</th>
                <th>Name</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Event list count</th>
                <th>Status</th>
                <th>DomainId</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {organisers.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.name}</td>
                  <td>{o.country}</td>
                  <td>{o.state}</td>
                  <td>{o.city}</td>
                  <td>{o.eventCount}</td>
                  <td>{o.status}</td>
                  <td>{o.domainId}</td>
                  <td>
                    <Link href={`/admin/organisers/${o.id}`}>
                      <button className="btn">View</button>
                    </Link>
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
