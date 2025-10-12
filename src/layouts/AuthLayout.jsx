import { Outlet } from "react-router-dom";
import { FloatingWhatsApp } from "../components/ui";

export default function AuthLayout() {
  return (
    <div className="min-h-screen">
      {/* Outlet akan menampilkan komponen auth pages */}
      <Outlet />
      <FloatingWhatsApp />
    </div>
  );
}
