import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./components/Sidebar";
import ProductEntry from "./pages/ProductEntry";
import Stock from "./pages/Stock";
import Dashboards from "./pages/Dashboards";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Index from "./pages/Index";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product-entry" element={<ProductEntry />} />
            <Route path="/estoque" element={<Stock />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/vendas" element={<Sales />} />
            <Route path="/relatorios" element={<Reports />} />
            {/* Additional routes can be added here */}
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;