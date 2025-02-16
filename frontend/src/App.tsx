import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./components/Sidebar";
import ProductEntry from "./pages/ProductEntry";
import Stock from "./pages/Stock";
import Dashboards from "./pages/Dashboards";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute"; // Componente de rota protegida
import "./index.css";
import Entries from "./pages/Entries";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Rotas públicas */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas protegidas */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Sidebar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/product-entry" element={<ProductEntry />} />
                  <Route path="/estoque" element={<Stock />} />
                  <Route path="/dashboards" element={<Dashboards />} />
                  <Route path="/vendas" element={<Sales />} />
                  <Route path="/relatorios" element={<Reports />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/entradas" element={<Entries />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
