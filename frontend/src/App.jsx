import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ClientDetail from "./pages/ClientDetail.jsx";
import AddTransaction from "./pages/AddTransaction.jsx";
import Anomalies from "./pages/Anomalies.jsx";

export default function App() {
  return (
    <div className="layout">
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients/:clientName" element={<ClientDetail />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/anomalies" element={<Anomalies />} />
      </Routes>
    </div>
  );
}
