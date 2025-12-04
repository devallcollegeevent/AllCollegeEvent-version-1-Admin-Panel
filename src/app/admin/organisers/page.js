'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOrganizersApi } from "@/lib/apiClient";

export default function OrganiserList() {
  const [orgData, setOrgData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrganizers() {
      const res = await getAllOrganizersApi();

      console.log("===org",res)

      if (res.success) {
        setOrgData(res.data);
      } else {
        console.log("API Error:", res.message);
      }

      setLoading(false);
    }

    loadOrganizers();
  }, []);

  if (loading) return <p>Loading organizers...</p>;

  console.log("=======ooo",orgData)

  return (
    <div>
      <h1>Organizer List</h1>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Organiser id</th>
                <th>Name</th>
                <th>Domain Email</th>
                <th>Category</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Verify</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orgData.data.map((org) => (
                <tr key={org.id}>
                  <td>{org.identity}</td>
                  <td>{org.organizationName}</td>
                  <td>{org.domainEmail}</td>
                  <td>{org.organizationCategory}</td>
                  <td>{org.country}</td>
                  <td>{org.state}</td>
                  <td>{org.city}</td>
                  <td>{org.isVerified? "verified" : "Not verified"}</td>

                  <td>
                    <Link href={`/admin/organisers/${org.identity}`}>
                      <button className="btn">View Events</button>
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
