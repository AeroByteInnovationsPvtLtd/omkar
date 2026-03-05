import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">

      {/* Background */}
      <div className="grid-background absolute inset-0 -z-10"></div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-gray-800 text-gray-400">
        © {new Date().getFullYear()} Omkar Patil
      </footer>
    </div>
  );
};

export default AppLayout;