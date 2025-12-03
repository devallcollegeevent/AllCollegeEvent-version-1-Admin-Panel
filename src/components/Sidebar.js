'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const menus = [
    { href: "/admin/organisers", label: "Organiser List" },
    { href: "/admin/events", label: "Event List" },
    { href: "/admin/users", label: "User List" },
  ];

  return (
    <>
      <div className="topbar">
        <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
        <strong>Admin Panel</strong>
      </div>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h2>Admin Panel</h2>

        {menus.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`navlink ${path && path.startsWith(m.href) ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {m.label}
          </Link>
        ))}
      </aside>
    </>
  );
}
