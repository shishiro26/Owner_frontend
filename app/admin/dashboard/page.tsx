// app/admin/dashboard/page.tsx
import Dashboard from "./compnents/Dashboard";
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-6 bg-gray-100">
        <Dashboard />
      </main>
    </div>
  );
}
