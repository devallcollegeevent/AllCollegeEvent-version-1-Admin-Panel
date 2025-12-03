import "../../app/globals.css";
import Sidebar from "../../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-root">
      <Sidebar />
      <div className="main">{children}</div>
    </div>
  );
}
